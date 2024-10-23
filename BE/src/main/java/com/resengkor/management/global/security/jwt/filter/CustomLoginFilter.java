package com.resengkor.management.global.security.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.jwt.dto.LoginDTO;
import com.resengkor.management.global.security.jwt.entity.RefreshToken;
import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class CustomLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final long ACCESS_TOKEN_EXPIRATION= 60 * 10 * 1000L; //10분

    public CustomLoginFilter(String defaultFilterUrl, AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshRepository refreshRepository) {
        setFilterProcessesUrl(defaultFilterUrl);
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    //실제 로그인 진행 메소드
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        log.info("------------------------------------------------");
        log.info("로그인 시작");
        log.info("------------------------------------------------");
        // DTO 클래스로 역직렬화
        LoginDTO loginDTO;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            // JSON 문자열을 파싱하여 빌더 패턴을 이용해 LoginDTO 객체 생성
           loginDTO = LoginDTO.builder()
                    .email(objectMapper.readTree(messageBody).get("email").asText())
                    .password(objectMapper.readTree(messageBody).get("password").asText())
                    .isAuto(objectMapper.readTree(messageBody).get("isAuto").asBoolean())
                    .build();
        } catch (IOException e) {
            log.info("------------------------------------------------");
            log.info("LoginDTO 직렬화 오류");
            log.info("------------------------------------------------");
            throw new CustomException(ExceptionStatus.EXCEPTION);
        }

        // 사용자 인증을 시도하기 위한 토큰 생성(아직 인증이 되지 않은 상태)
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());

        //여기서 authenticationManager가 인증을 대신 처리
        authToken.setDetails(loginDTO);
        return authenticationManager.authenticate(authToken);
    }

    @Override
    //로그인 성공 핸들러 -> 여기서 jwt발급
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
        log.info("------------------------------------------------");
        log.info("로그인 성공해서 로그인 성공 핸들러 동작");
        log.info("------------------------------------------------");

        //1. authentication에서 유저 정보를 가져오자.
        String email = authentication.getName();
        LoginDTO loginDTO = (LoginDTO) authentication.getDetails();
        boolean isAuto = loginDTO.isAuto();

        //user의 role값을 가져온다.
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();
        log.info("------------------------------------------------");
        log.info("isAuto = {}, role = {}",isAuto,role);
        log.info("------------------------------------------------");

        //2. 토큰 생성
        //"access"를 통해 카테고리값을 넣어준다.
        long refreshTokenExpiration = isAuto ? 30 * 24 * 60 * 60 * 1000L : 24 * 60 * 60 * 1000L; //로그인 유지 30일, 일반 24시간
        String access = jwtUtil.createJwt("access", email, role, ACCESS_TOKEN_EXPIRATION,isAuto);
        String refresh = jwtUtil.createJwt("refresh", email, role, refreshTokenExpiration,isAuto);

        //2-1. Refresh 토큰 DB에 저장 메소드
        addRefreshEntity(email, refresh, refreshTokenExpiration);
        log.info("------------------------------------------------");
        log.info("Refresh토큰 DB에 저장 성공");
        log.info("------------------------------------------------");

        //3. 응답 설정
        response.setHeader("Authorization", "Bearer " + access);
        response.setHeader("Refresh", refresh);
        response.setStatus(HttpStatus.OK.value());
    }

    //Refresh 토큰 DB에 저장 메소드
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
        log.info("------------------------------------------------");
        log.info("로그인 실패");
        log.info("------------------------------------------------");
        response.setStatus(401);
    }
}