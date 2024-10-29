package com.resengkor.management.global.security.jwt.filter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;


import java.io.IOException;

@Component
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        log.info("------------------------------------------------");
        log.info("CustomAuthenticationEntryPoint - comment method enter");
        log.info("------------------------------------------------");

        // 401 Unauthorized 상태 설정
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json; charset=UTF-8");

        // 인증 실패 메시지를 JSON 형식으로 전송
        response.getWriter().write("{\"error\": \"인증이 필요합니다. 로그인이 필요합니다.\"}");
        response.getWriter().flush();
    }
}
