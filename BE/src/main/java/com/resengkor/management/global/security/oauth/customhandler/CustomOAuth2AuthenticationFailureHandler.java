package com.resengkor.management.global.security.oauth.customhandler;

import com.resengkor.management.global.util.EnvironmentUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
public class CustomOAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {
    private static final String LOCAL_REDIRECT_URL = "http://localhost:5173/signin?error=true&message=";
    private static final String PRODUCTION_REDIRECT_URL = "https://reseng.co.kr/signin?error=true&message=";

    //CustomOAuth2UserService에서 에러 던짐
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.info("----------CustomOAuth2AuthenticationFailureHandler Start-----------------");
        log.info("----------CustomOAuthUserService에서 에러 발생-----------------");

        if (exception instanceof OAuth2AuthenticationException) {
            OAuth2AuthenticationException oauth2Exception = (OAuth2AuthenticationException) exception;
            String errorCode = oauth2Exception.getError().getErrorCode();
            String errorMessage = oauth2Exception.getError().getDescription();

            // 비활성화된 사용자 오류 메시지 확인
            // 이미 같은 이메일로 local로 회원가입함.
            if ("member_inactive".equals(errorCode) || "member_already_register_local".equals(errorCode) ) {
                // 비활성화된 사용자일 때 로그인 페이지로 리다이렉트
                redirectToErrorPage(request, response, errorMessage);
                return;
            }
        }
        // 일반적인 인증 실패 시
        redirectToErrorPage(request, response, "인증에 실패했습니다.");
    }

    private void redirectToErrorPage(HttpServletRequest request, HttpServletResponse response, String errorMessage) throws IOException {
        // 환경에 맞는 리다이렉트 URL 설정
        String redirectUrl;

        //1. 첫 번째 테스트
        log.info("--------------첫 번째 테스트-----------------------");
        if (EnvironmentUtil.isLocalEnvironment(request)) {
            // 로컬 환경에서는 localhost로 리다이렉트
            log.info("로컬 환경으로 리다이렉트");
//            redirectUrl = LOCAL_REDIRECT_URL + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8);
        } else {
            // 배포 환경에서는 실제 도메인으로 리다이렉트
//            redirectUrl = PRODUCTION_REDIRECT_URL + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8);
            log.info("배포 환경으로 리다이렉트");
        }


        // 2. 두 번째 테스트 : Nginx에서 추가한 헤더 정보 확인
        log.info("--------------두 번째 테스트-----------------------");
        String environment = request.getHeader("X-Frontend-Environment");
        log.info("nginx 헤더 정보  = {}", environment);

        if ("production".equals(environment)) {
            // 배포 환경일 때 처리 (리다이렉트 또는 쿠키 추가 등)
            log.info("배포 환경으로 리다이렉트");
            redirectUrl = PRODUCTION_REDIRECT_URL + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8);
        } else if ("local".equals(environment)) {
            // 로컬 환경일 때 처리
            log.info("로컬 환경으로 리다이렉트");
            redirectUrl = LOCAL_REDIRECT_URL + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8);
        }else {
            log.error("X-Frontend-Environment 값이 비어있거나 알 수 없는 값입니다. 기본값으로 처리.");
            redirectUrl = PRODUCTION_REDIRECT_URL;
        }


        response.sendRedirect(redirectUrl);
    }
}
