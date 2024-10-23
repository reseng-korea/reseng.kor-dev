package com.resengkor.management.global.security.jwt.filter;

import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.util.CookieUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.Arrays;

/**
 * 로그아웃 필터
 * refresh 토큰 만료
 */
//@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final String defaultFilterUrl;

    public CustomLogoutFilter(String defaultFilterUrl, JWTUtil jwtUtil, RefreshRepository refreshRepository) {
        this.defaultFilterUrl = defaultFilterUrl;
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        //path and method verify
        //해당요청이 logout요청인지 판단
//        String requestURI = request.getRequestURI();
        // uri check
        if (!defaultFilterUrl.matches("^\\/api/v1/logout$")) {
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

        // refresh token validation
        // refresh 토큰인지
        //get refresh token

        String refresh = null;
        refresh = request.getHeader("Refresh");


//        String refresh = null;
//        Cookie[] cookies = request.getCookies();
//
//        refresh = Arrays.stream(cookies).filter(cookie -> cookie.getName().equals("refresh"))
//                .findFirst().get().getValue();

        System.out.println("refresh = " + refresh);

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
        Boolean isExist = refreshRepository.existsByRefresh(refresh);

        // not exist in DB
        if(!isExist){
            //없다면 이미 로그아웃인 상태
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // logout
        //로그아웃 진행
        //Refresh 토큰 DB에서 제거
        refreshRepository.deleteByRefresh(refresh);
    }
}
