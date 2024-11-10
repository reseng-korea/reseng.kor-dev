package com.resengkor.management.global.security.jwt.filter;

import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
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
//@RequiredArgsConstructor
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
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        //해당요청이 logout요청인지 판단
        // uri check
        if (!request.getRequestURI().equals(defaultFilterUrl)) {
            //로그아웃이 아니면 다음 필터로 넘어감
            chain.doFilter(request, response);
            return;
        }
        // method check
        String requestMethod = request.getMethod();
        ExceptionStatus exceptionStatus;
        if (!requestMethod.equals("POST")) {
            //로그아웃이더라도 post가 아니면 넘어감
//            chain.doFilter(request, response);
//            return;
            // POST가 아닌 요청인 경우 405 에러 반환
            ErrorHandler.sendErrorResponse(response, ExceptionStatus.METHOD_NOT_ALLOWED, HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            return;
        }

        String refresh = null;
        refresh = request.getHeader("Refresh");

        log.info("refresh = " + refresh);

        // refresh token null
        if(refresh == null){
            ErrorHandler.sendErrorResponse(response, ExceptionStatus.TOKEN_NOT_FOUND_IN_HEADER, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        // not refresh token
        if("Refresh".equals(category)){
            ErrorHandler.sendErrorResponse(response, ExceptionStatus.TOKEN_PARSE_ERROR, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Redis에서 refresh 토큰 존재 여부 확인
        Boolean isExist = redisUtil.existData("refresh:token:" + refresh);

        // not exist in DB
        if(!isExist){
            //없다면 이미 로그아웃인 상태
            ErrorHandler.sendErrorResponse(response, ExceptionStatus.TOKEN_NOT_FOUND_IN_DB, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // logout
        //로그아웃 진행
        //Refresh 토큰 DB에서 제거

        boolean isDeleted = redisUtil.deleteData("refresh:token:" + refresh);
        if (!isDeleted) {
            log.error("로그아웃: Refresh 토큰 삭제 실패 (Redis 연결 오류)");
            // Redis 오류 시 예외 던지기
            ErrorHandler.sendErrorResponse(response, ExceptionStatus.DB_CONNECTION_ERROR, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        log.info("로그아웃: Refresh 토큰 삭제 성공");
    }
}
