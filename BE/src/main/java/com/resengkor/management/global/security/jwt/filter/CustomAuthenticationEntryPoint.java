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

        // 예외 처리 로직을 공통 메서드로 위임
        ErrorHandler.handleAuthenticationException(response, authException);
    }
}
