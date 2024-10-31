package com.resengkor.management.global.security.oauth.customhandler;

import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.jwt.service.RefreshTokenService;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.security.oauth.dto.CustomOAuth2User;
import com.resengkor.management.global.util.CookieUtil;
import com.resengkor.management.global.util.RedisUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.concurrent.TimeUnit;

/**
 * OAuth2 로그인 성공 후 JWT 발급
 * access, refresh -> httpOnly 쿠키
 * 리다이렉트 되기 때문에 헤더로 전달 불가능
 */
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JWTUtil jwtUtil;
//    private final RefreshTokenService refreshTokenService;
    private final RedisUtil redisUtil;
    private final Integer ACCESS_TOKEN_EXPIRATION= 60 * 30;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        log.info("------------------------------------------------");
        log.info("Enter OAuth login success handler");
        log.info("------------------------------------------------");
        // create JWT
        CustomOAuth2User customOAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String email = customOAuth2User.getEmail();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        long userId = customOAuth2User.getUserId();
        log.info("------------------------------------------------");
        log.info("email = {}",email);
        log.info("role = {}",role);
        log.info("userId = {}",userId);
        log.info("------------------------------------------------");


        Integer expireS = 30 * 24 * 60 * 60; //기본 30일
        String access = jwtUtil.createOuathJwt("Authorization", "social", email, userId, role, ACCESS_TOKEN_EXPIRATION * 1000L);
        String refresh = jwtUtil.createOuathJwt("Refresh", "social", email, userId, role, expireS * 1000L);

        // refresh 토큰 DB 저장
//        refreshTokenService.saveRefresh(username, expireS, refresh);
        // Redis에 새로운 Refresh Token 저장
        redisUtil.setData("refresh:token:" + refresh, refresh, expireS * 1000L, TimeUnit.MILLISECONDS);

        response.addCookie(CookieUtil.createCookie("Authorization", access, ACCESS_TOKEN_EXPIRATION));
        response.addCookie(CookieUtil.createCookie("Refresh", refresh, expireS));

        // redirect query param 인코딩 후 전달
        // 이후에 JWT 를 읽어서 데이터를 가져올 수도 있지만, JWT 파싱 비용이 많이 들기 때문에
        // 처음 JWT 발급할 때 이름을 함께 넘긴 후, 로컬 스토리지에 저장한다.
//        String encodedName = URLEncoder.encode(name, "UTF-8");
//        response.sendRedirect("http://localhost:3000/oauth2-jwt-header?name=" + encodedName);
        response.sendRedirect("http://localhost:3000/oauth2-jwt-header");
    }

}
