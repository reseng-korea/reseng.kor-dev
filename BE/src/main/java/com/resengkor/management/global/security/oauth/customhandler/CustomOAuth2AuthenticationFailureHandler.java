package com.resengkor.management.global.security.oauth.customhandler;

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
                response.sendRedirect("http://localhost:5173/login?error=true&message=" + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8));
                return;
            }
        }
        // 일반적인 인증 실패 시
        response.sendRedirect("http://localhost:5173/login?error=true&message=" + URLEncoder.encode("인증에 실패했습니다.", StandardCharsets.UTF_8));
    }
}
