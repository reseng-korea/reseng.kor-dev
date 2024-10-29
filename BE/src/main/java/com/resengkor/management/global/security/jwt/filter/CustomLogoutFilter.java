package com.resengkor.management.global.security.jwt.filter;

import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
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
//    private final RefreshRepository refreshRepository;
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
        if (!requestMethod.equals("POST")) {
            //로그아웃이더라도 post가 아니면 넘어감
            chain.doFilter(request, response);
            return;
        }

        String refresh = null;
        refresh = request.getHeader("Refresh").trim();

        log.info("refresh = " + refresh);

        // refresh token null
        if(refresh == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        // not refresh token
        if(!category.equals("refresh")){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        //DB에 저장되어 있는지 확인
//        Boolean isExist = refreshRepository.existsByRefresh(refresh);
        // Redis에서 refresh 토큰 존재 여부 확인
        Boolean isExist = redisUtil.existData("refresh:token:" + refresh);

        // not exist in DB
        if(!isExist){
            //없다면 이미 로그아웃인 상태
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // logout
        //로그아웃 진행
        //Refresh 토큰 DB에서 제거
//        refreshRepository.deleteByRefresh(refresh);
        redisUtil.deleteData("refresh:token:" + refresh);
    }
}
