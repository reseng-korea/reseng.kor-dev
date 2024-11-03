package com.resengkor.management.global.security.jwt.filter;

import com.resengkor.management.global.exception.ExceptionStatus;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.HttpRequestMethodNotSupportedException;


import java.io.IOException;

@Component
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        log.info("------------------------------------------------");
        log.info("CustomAuthenticationEntryPoint - Handling exception");
        log.info("Request URI: {}", request.getRequestURI());
        log.info("Authorization Header: {}", request.getHeader("Authorization"));
        log.info("Exception Message: {}", authException.getMessage());
        log.info("------------------------------------------------");

        // 예외 스택 트레이스 로그 (디버깅용, 운영에서는 비활성화 권장)
        authException.printStackTrace();

        response.setContentType("application/json; charset=UTF-8");

        ExceptionStatus exceptionStatus;

        // 1. 잘못된 HTTP 메서드 요청: 예를 들어, POST 요청이 필요한 엔드포인트에 GET 요청이 들어왔을 때 발생
        if (authException.getCause() instanceof HttpRequestMethodNotSupportedException) {
            log.info("HttpRequestMethodNotSupportedException detected");
            response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            exceptionStatus = ExceptionStatus.METHOD_NOT_ALLOWED;
        }
        // 2. 잘못된 자격 증명: 사용자 이름이나 비밀번호가 잘못된 경우 발생
        else if (authException instanceof BadCredentialsException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.AUTHENTICATION_FAILED;
        }
        // 3. 사용자 이름을 찾을 수 없는 경우: 데이터베이스에 해당 사용자 이름이 존재하지 않을 때 발생
        else if (authException instanceof UsernameNotFoundException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.MEMBER_NOT_FOUND;
        }
        // 4. 계정 만료: 계정이 더 이상 유효하지 않은 경우 발생
        else if (authException instanceof AccountExpiredException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.MEMBER_PROFILE_NOT_FOUND;
        }
        // 5. 자격 증명 만료: 예를 들어, 비밀번호가 만료된 경우 발생
        else if (authException instanceof CredentialsExpiredException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.INVALID_PASSWORD;
        }
        // 6. 계정이 비활성화된 경우: 관리자에 의해 계정이 비활성화된 경우 발생
        else if (authException instanceof DisabledException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.MEMBER_INACTIVE;
        }
        // 7. 계정이 잠긴 경우: 여러 번의 잘못된 로그인 시도로 인해 계정이 잠긴 경우 발생
        else if (authException instanceof LockedException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.ACCESS_DENIED;
        }
        // 8. 인증 정보가 부족한 경우: 예를 들어, 인증 토큰이 누락된 경우 발생
        else if (authException instanceof InsufficientAuthenticationException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.TOKEN_NOT_FOUND_IN_HEADER;
        }
        // 9. 기타 인증 관련 예외: 위에 정의되지 않은 다른 인증 오류 발생 시 처리
        else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            exceptionStatus = ExceptionStatus.EXCEPTION;
        }

        // Return the code and message from ExceptionStatus
        response.getWriter().write("{\"code\": " + exceptionStatus.getCode() + ", " +
                "\"message\": \"" + exceptionStatus.getMessage() + "\"}");
        response.getWriter().flush();
    }
}
