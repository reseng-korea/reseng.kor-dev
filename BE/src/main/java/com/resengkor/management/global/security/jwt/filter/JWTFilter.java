package com.resengkor.management.global.security.jwt.filter;

import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.global.security.jwt.dto.CustomUserDetails;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 이미 액세스 토큰이 있는 경우,
 * 내부에서 사용할 authentication 정보를 set
 */

@RequiredArgsConstructor
@Slf4j
public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("------------------------------------------------");
        log.info("JWT token filter in");
        log.info("------------------------------------------------");
        // 헤더에서 access키에 담긴 토큰을 꺼냄
        String access = null;
        access = request.getHeader("Authorization");
        log.info("Access = "+access);

        // 토큰이 없다면 다음 필터로 넘김
        if (access == null) {
            //권한이 필요없는 api일 수도 있으니 일단 넘김
            filterChain.doFilter(request, response);
            log.info("------------------------------------------------");
            log.info("Access토큰 없음");
            log.info("권한이 필요없는 api일 수도 있으니 일단 넘김");
            log.info("------------------------------------------------");
            return;
        }
        // 토큰이 있다면
        // 토큰 만료 여부 확인, 만료시 다음 필터로 넘기지 않음
        try{
            jwtUtil.isExpired(access);
        } catch (ExpiredJwtException e){
            log.info("------------------------------------------------");
            log.info("Access토큰 만료");
            log.info("------------------------------------------------");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 토큰이 access인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(access);

        // not access token
        if(!category.equals("access")){
            log.info("------------------------------------------------");
            log.info("Access토큰이 아님");
            log.info("------------------------------------------------");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // username, role 값을 획득
        //일시적인 세션을 만듬
        //로그인 진행시킴
        String email = jwtUtil.getEmail(access);
        String roleString = jwtUtil.getRole(access);
        Long userId = jwtUtil.getUserId(access);
        // 문자열을 enum으로 변환
        Role role;
        try {
            role = Role.valueOf(roleString); // Enum으로 변환
        } catch (IllegalArgumentException e) {
            // 잘못된 역할이 들어온 경우 처리
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        User userPrincipal = User.builder()
                .id(userId)
                .email(email)
                .role(role)
                .password("temp_pw")
                .build();

        CustomUserDetails customUserDetails = new CustomUserDetails(userPrincipal);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
        log.info("------------------------------------------------");
        log.info("jwt필터 넘어감");
        log.info("------------------------------------------------");

        filterChain.doFilter(request, response);
    }
}
