package com.resengkor.management.global.security.oauth.customhandler;

import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.security.oauth.dto.CustomOAuth2User;
import com.resengkor.management.global.security.oauth.repository.HttpCookieOAuth2AuthorizationRequestRepository;
import com.resengkor.management.global.util.CookieUtil;
import com.resengkor.management.global.util.EnvironmentUtil;
import com.resengkor.management.global.util.RedisUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * OAuth2 로그인 성공 후 JWT 발급
 * access, refresh -> httpOnly 쿠키
 * 리다이렉트 되기 때문에 헤더로 전달 불가능
 */
@RequiredArgsConstructor
@Slf4j
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JWTUtil jwtUtil;
    private final RedisUtil redisUtil;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    private final Integer ACCESS_TOKEN_EXPIRATION = 60 * 60; //1시간
    private final String LOCAL_REDIRECT_URL = "http://localhost:5173/jwt-header-oauth2";
    private final String PRODUCTION_REDIRECT_URL = "https://reseng.co.kr/jwt-header-oauth2";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("----Handler Start : OAuth 로그인 성공-----");

        // create JWT
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String email = customOAuth2User.getEmail();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        long userId = customOAuth2User.getUserId();

        log.info("------------------------------------------------");
        log.info("email = {}", email);
        log.info("role = {}", role);
        log.info("userId = {}", userId);
        log.info("------------------------------------------------");

        try {
            String sessionId = UUID.randomUUID().toString();
            Integer expireS = 30 * 24 * 60 * 60; // 기본 30일
            String access = jwtUtil.createOuathJwt("Authorization", "social", email, userId, role, ACCESS_TOKEN_EXPIRATION * 1000L,sessionId);
            String refresh = jwtUtil.createOuathJwt("Refresh", "social", email, userId, role, expireS * 1000L,sessionId);

            // Redis에 새로운 Refresh Token 저장
            String redisKey = "refresh_token:" + email + ":" + sessionId;
            boolean isSaved = redisUtil.setData(redisKey, refresh, expireS * 1000L, TimeUnit.MILLISECONDS);
            if (!isSaved) {
                log.error("OAuth 로그인 성공 후: Refresh 토큰 저장 실패 (Redis 연결 오류)");
                throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR); // Redis 저장 실패 에러 던지기
            }

            // 쿠키에 JWT 토큰 추가
            response.addCookie(CookieUtil.createCookie("Authorization", access, ACCESS_TOKEN_EXPIRATION));
            response.addCookie(CookieUtil.createCookie("Refresh", refresh, expireS));

            // 리다이렉트 처리
            /*
            redirect query param 인코딩 후 전달
            이후에 JWT 를 읽어서 데이터를 가져올 수도 있지만, JWT 파싱 비용이 많이 들기 때문에
            처음 JWT 발급할 때 이름을 함께 넘긴 후, 로컬 스토리지에 저장한다.
             */
//        String encodedName = URLEncoder.encode(name, "UTF-8");
//        response.sendRedirect("http://localhost:5173/oauth2-jwt-header?name=" + encodedName);


            // 환경에 맞는 리다이렉트 URL 설정
//            String redirectUrl;
//            //1. 첫 번째 테스트
//            log.info("--------------첫 번째 테스트-----------------------");
//            if (EnvironmentUtil.isLocalEnvironment(request)) { //로컬
//                log.info("로컬 환경으로 리다이렉트");
////                redirectUrl = LOCAL_REDIRECT_URL;
//            } else {
//                // 배포 환경에서는 실제 도메인으로 리다이렉트
//                log.info("배포 환경으로 리다이렉트");
////                redirectUrl = SERVER_REDIRECT_URL;
//            }
//
//            // 2. 두 번째 테스트 : Nginx에서 추가한 헤더 정보 확인
//            log.info("--------------두 번째 테스트-----------------------");
//            String environment = request.getHeader("X-Frontend-Environment");
//            log.info("nginx 헤더 정보  = {}", environment);
//
//            if ("production".equals(environment)) {//배포
//                log.info("배포 환경으로 리다이렉트");
//                redirectUrl = PRODUCTION_REDIRECT_URL;
//
//            } else if ("local".equals(environment)) {
//                log.info("로컬 환경으로 리다이렉트");
//                redirectUrl = LOCAL_REDIRECT_URL;
//            } else {
//                log.error("X-Frontend-Environment 값이 비어있거나 알 수 없는 값입니다. 기본값으로 처리.");
//                redirectUrl = PRODUCTION_REDIRECT_URL;
//            }


            // 3. 세 번째 테스트: AuthorizationRequestRepository에서 환경 정보 확인
            log.info("--------------세 번째 테스트-----------------------");
            // Load frontend value from cookies
            String frontend = CookieUtil.getCookie(request, HttpCookieOAuth2AuthorizationRequestRepository.FRONTEND_PARAM_COOKIE_NAME)
                    .map(Cookie::getValue)
                    .orElse("production"); // Default to production if not set

            // Determine redirect URL based on frontend value
            String redirectUri = "local".equals(frontend)
                    ? LOCAL_REDIRECT_URL
                    : PRODUCTION_REDIRECT_URL;

            log.info("redirectUri = {}", redirectUri);

            // Clean up cookies
            httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);

            //최종 redirec
            response.sendRedirect(redirectUri);



        } catch (Exception e) {
            log.error("OAuth 로그인 성공 후 토큰 생성 또는 저장 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ExceptionStatus.EXCEPTION); // 일반 예외 처리
        }
    }
}