package com.resengkor.management.global.security.jwt.filter;

import com.resengkor.management.global.exception.ExceptionStatus;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;

import java.io.IOException;

@Slf4j
public class ErrorHandler {

    public static void handleAuthenticationException(HttpServletResponse response, AuthenticationException exception) throws IOException {
        response.setContentType("application/json; charset=UTF-8");

        ExceptionStatus exceptionStatus;

        // 잘못된 HTTP 메서드 요청
        if (exception.getCause() instanceof HttpRequestMethodNotSupportedException) {
            log.info("HttpRequestMethodNotSupportedException detected");
            response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            exceptionStatus = ExceptionStatus.METHOD_NOT_ALLOWED;
        }
        // 잘못된 자격 증명
        else if (exception instanceof BadCredentialsException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.INVALID_CREDENTIALS;
        }
        // 사용자 이름을 찾을 수 없는 경우
        else if (exception instanceof UsernameNotFoundException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.USER_NOT_FOUND;
        }
        // 계정이 비활성화된 경우
        else if (exception instanceof DisabledException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.ACCOUNT_DISABLED;
        }
        // 인증 정보가 부족한 경우
        else if (exception instanceof InsufficientAuthenticationException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.TOKEN_NOT_FOUND_IN_HEADER;
        }
        // 기타 인증 관련 예외
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.AUTHENTICATION_FAILED;
        }

        // Return the code and message from ExceptionStatus
        response.getWriter().write("{\"code\": " + exceptionStatus.getCode() + ", " +
                "\"message\": \"" + exceptionStatus.getMessage() + "\"}");
        response.getWriter().flush();
    }
}