package com.resengkor.management.global.security.jwt.filter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        log.info("------------------------------------------------");
        log.info("CustomAccessDeniedHandler - handle method enter");
        log.info("Request URI: {}", request.getRequestURI());
        log.info("HTTP Method: {}", request.getMethod());
        log.info("Remote Address: {}", request.getRemoteAddr());
        log.info("User: {}", request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : "Anonymous");
        log.info("Exception Message: {}", accessDeniedException.getMessage());

        // 현재 사용자 정보와 권한 확인
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            log.info("Authenticated User: {}", auth.getName());
            log.info("Authorities: {}", auth.getAuthorities());
            log.info("Principal: {}", auth.getPrincipal());
            log.info("Details: {}", auth.getDetails());
        } else {
            log.info("Authentication object is null, indicating an unauthenticated user.");
        }


        // 403 Forbidden 상태 설정
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json; charset=UTF-8");

        // 권한 부족 메시지를 JSON 형식으로 전송
        response.getWriter().write("{\"error\": \"접근 권한이 없습니다. 관리자에게 문의하세요.\", " +
                "\"message\": \"" + accessDeniedException.getMessage() + "\"}");
        response.getWriter().flush();
    }
}
