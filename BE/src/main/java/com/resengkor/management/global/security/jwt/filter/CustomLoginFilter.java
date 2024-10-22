package com.resengkor.management.global.security.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.global.security.jwt.dto.LoginDTO;
import com.resengkor.management.global.security.jwt.entity.RefreshToken;
import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

//@Component -> 금지. authenticationManager must be specified 오류 남.
//@RequiredArgsConstructor
public class CustomLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final long ACCESS_TOKEN_EXPIRATION=600000L;

    public CustomLoginFilter(String defaultFilterUrl, AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshRepository refreshRepository) {
        setFilterProcessesUrl(defaultFilterUrl);
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        System.out.println("authentication in");
        LoginDTO loginDTO;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            // JSON 문자열을 파싱하여 빌더 패턴을 이용해 LoginDTO 객체 생성
           loginDTO = LoginDTO.builder()
                    .email(objectMapper.readTree(messageBody).get("email").asText())
                    .password(objectMapper.readTree(messageBody).get("password").asText())
                    .build();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String email = loginDTO.getEmail();
        String password = loginDTO.getPassword();

        System.out.println(email);

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    //로그인 성공 핸들러
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
        System.out.println("if login sucess, handler move");

        //로그인 성공하면 동작함. => 2개의 토큰을 발급하자!
        //2개의 토큰 발급
        //1. authentication에서 유저 정보를 가져오자.
        String email = authentication.getName();

        //user의 role값을 가져온다.
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //2. 토큰 생성
        //"access"를 통해 카테고리값을 넣어준다.
        boolean isAuto = false;
        long refreshTokenExpiration = isAuto ? 2592000000L : 86400000L; //로그인 유지 30일, 일반 24시간
        String access = jwtUtil.createJwt("access", email, role, ACCESS_TOKEN_EXPIRATION);
        String refresh = jwtUtil.createJwt("refresh", email, role, refreshTokenExpiration);

        //2-1. Refresh 토큰 DB에 저장 메소드
        addRefreshEntity(email, refresh, refreshTokenExpiration);

        //3. 응답 설정
        //access는 응답헤더에
        //refresh는 쿠키에
        response.setHeader("Authorization", access);
        response.setHeader("Refresh", refresh);
//        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());
    }

    private void addRefreshEntity(String email, String refresh, Long expiredMs) {
        Date date = new Date(System.currentTimeMillis() + expiredMs);
        RefreshToken refreshToken = RefreshToken.builder()
                .email(email)
                .refresh(refresh)
                .expiration(date.toString())
                .build();
        refreshRepository.save(refreshToken);
    }

    //로그인 실패시 실행
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        System.out.println("login fail move");
        response.setStatus(401);
    }
}