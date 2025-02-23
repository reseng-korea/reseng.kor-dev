package com.resengkor.management.global.security.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.util.CookieUtil;
import com.resengkor.management.global.util.RedisUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

/**
 * 로그아웃 필터
 * refresh 토큰 만료
 */
@Slf4j
public class CustomLogoutFilter extends GenericFilterBean {
    private final JWTUtil jwtUtil;
    private final RedisUtil redisUtil;
    private final String defaultFilterUrl;

    public CustomLogoutFilter(String defaultFilterUrl, JWTUtil jwtUtil, RedisUtil redisUtil) {
        this.defaultFilterUrl = defaultFilterUrl;
        this.jwtUtil = jwtUtil;
        this.redisUtil = redisUtil;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        log.info("----Filter Start: 로그아웃 진행-----");
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        log.info("----Filter Start: 내부 필터 로그아웃 진행-----");

        // 로그아웃 요청이 아니면 필터 통과
        if (!request.getRequestURI().equals(defaultFilterUrl)) {
            chain.doFilter(request, response);
            return;
        }

        // 로그아웃 요청은 반드시 POST 메서드만 허용
        if (!"POST".equals(request.getMethod())) {
            sendErrorResponse(response, ExceptionStatus.METHOD_NOT_ALLOWED, HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            return;
        }

        // 프론트에서 보낸 AccessToken 가져오기
        String accessToken = request.getHeader("Authorization");
        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            sendErrorResponse(response, ExceptionStatus.TOKEN_NOT_FOUND_IN_HEADER, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        accessToken = accessToken.substring(7); // "Bearer " 제거

        // AccessToken에서 email과 sessionId 추출
        String email = jwtUtil.getEmail(accessToken);
        String sessionId = jwtUtil.getSessionId(accessToken);

        if (email == null || sessionId == null) {
            sendErrorResponse(response, ExceptionStatus.TOKEN_PARSE_ERROR, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Redis에서 refresh 토큰 가져오기
        String redisKey = "refresh_token:" + email + ":" + sessionId;
        String refreshToken = redisUtil.getData(redisKey);

        if (refreshToken == null) {
            sendErrorResponse(response, ExceptionStatus.TOKEN_NOT_FOUND_IN_DB, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Refresh 토큰이 유효한지 확인
        String category = jwtUtil.getCategory(refreshToken);
        if (!"Refresh".equals(category)) {
            sendErrorResponse(response, ExceptionStatus.TOKEN_PARSE_ERROR, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Redis에서 Refresh 토큰 삭제
        boolean isDeleted = redisUtil.deleteData(redisKey);
        if (!isDeleted) {
            log.error("로그아웃 실패: Redis에서 Refresh 토큰 삭제 실패");
            sendErrorResponse(response, ExceptionStatus.DB_CONNECTION_ERROR, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        log.info("로그아웃 성공: Refresh 토큰 삭제 완료");

        // 성공 응답 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        
        // Refresh 토큰 쿠키 삭제
        response.addCookie(CookieUtil.createCookie("Refresh", null, 0));

        CommonResponse commonResponse = new CommonResponse(ResponseStatus.RESPONSE_SUCCESS.getCode(), "로그아웃에 성공했습니다");
        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(commonResponse));
        response.getWriter().flush();
    }

    private void sendErrorResponse(HttpServletResponse response, ExceptionStatus status, int httpStatusCode) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(httpStatusCode);

        CommonResponse commonResponse = new CommonResponse(status.getCode(), status.getMessage());
        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(commonResponse));
        response.getWriter().flush();
    }
}
