package com.resengkor.management.global.security.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.jwt.dto.CustomUserDetails;
import com.resengkor.management.global.security.jwt.dto.LoginDTO;
import com.resengkor.management.global.security.jwt.dto.LoginResponse;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.util.RedisUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;

//@Component -> 금지. authenticationManager must be specified 오류 남.
@Slf4j
public class CustomLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RedisUtil redisUtil;
    private final long ACCESS_TOKEN_EXPIRATION= 60 * 60 * 1000L; //1시간

    public CustomLoginFilter(String defaultFilterUrl, AuthenticationManager authenticationManager, JWTUtil jwtUtil, RedisUtil redisUtil) {
        setFilterProcessesUrl(defaultFilterUrl);
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.redisUtil = redisUtil;
    }

    //실제 로그인 진행 메소드
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        log.info("----Filter Start: 로그인 진행-----");

        // 메서드가 POST인지 확인
        if (!request.getMethod().equalsIgnoreCase("POST")) {
            try {
                ErrorHandler.sendErrorResponse(response, ExceptionStatus.METHOD_NOT_ALLOWED, HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return null; // POST 요청이 아닌 경우 인증 시도 중단
        }

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
            log.info("LoginDTO 역직렬화 오류: " + e.getMessage());
            log.info("------------------------------------------------");
            throw new CustomException(ExceptionStatus.EXCEPTION);
        }
        // 이메일 유효성 검사: 이메일이 비어있거나 형식이 맞지 않으면 오류 발생
        try {
            // email, password 등의 유효성 검사 로직
            if (loginDTO.getEmail() == null || loginDTO.getEmail().isBlank()) {
                throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
            }
            // 이메일 형식 확인 (간단한 정규식 사용)
            if (!loginDTO.getEmail().matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
            }
            // 비밀번호 유효성 검사: 비밀번호가 비어있거나 형식이 맞지 않으면 오류 발생
            if (loginDTO.getPassword() == null || !loginDTO.getPassword().matches("(?=.*\\W)(?=\\S+$).{8,16}")) {
                throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
            }
        } catch (CustomException e) {
            throw new AuthenticationServiceException("Validation error", e);
        }

        // 사용자 인증을 시도하기 위한 토큰 생성(아직 인증이 되지 않은 상태)
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());

        //여기서 authenticationManager가 인증을 대신 처리
        authToken.setDetails(loginDTO);
        return authenticationManager.authenticate(authToken);
    }

    @Override
    //로그인 성공 핸들러 -> 여기서 jwt발급
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        log.info("----Filter Start: 로그인 성공 핸들러 진행-----");

        //1. authentication에서 유저 정보를 가져오자.
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        String email = customUserDetails.getUsername();
        long userId = customUserDetails.getUserId();
        LoginDTO loginDTO = (LoginDTO) authentication.getDetails();
        boolean isAuto = loginDTO.isAuto();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();//user의 role값을 가져온다.
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //2. 토큰 생성
        //"access"를 통해 카테고리값을 넣어준다.
        long refreshTokenExpiration = isAuto ? 30 * 24 * 60 * 60 * 1000L : 24 * 60 * 60 * 1000L; //로그인 유지 30일, 일반 24시간
        String access = jwtUtil.createJwt("Authorization", "local", email, userId, role, ACCESS_TOKEN_EXPIRATION,isAuto);
        String refresh = jwtUtil.createJwt("Refresh", "local", email, userId, role, refreshTokenExpiration,isAuto);

        //2-1. Refresh 토큰 DB에 저장 메소드
        boolean isStored = redisUtil.setData("refresh:token:" + email, refresh, refreshTokenExpiration, TimeUnit.MILLISECONDS);
        if (!isStored) {
            log.error("로그인 성공: Refresh 토큰 Redis 저장 실패 (Redis 연결 오류)");
            ErrorHandler.sendErrorResponse(response, ExceptionStatus.DB_CONNECTION_ERROR, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return; // 오류 발생 시 메서드 종료
        }
        log.info("Refresh토큰 DB에 저장 성공");


        // 3. JSON 응답 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpStatus.OK.value());

        response.setHeader("Authorization", "Bearer " + access);
        response.setHeader("Refresh", refresh);

        // 응답 JSON 생성
        LoginResponse loginResponse = LoginResponse.builder()
                .id(userId)
                .email(email)
                .emailStatus(customUserDetails.isEmailStatus())
                .temporaryPasswordStatus(customUserDetails.isTemporaryPasswordStatus())
                .companyName(customUserDetails.getCompanyName())
                .representativeName(customUserDetails.getRepresentativeName())
                .phoneNumber(customUserDetails.getPhoneNumber())
                .phoneNumberStatus(customUserDetails.isPhoneNumberStatus())
                .role(role)
                .loginType(customUserDetails.getLoginType())
                .status(customUserDetails.isEnabled())
                .build();

        // 응답 출력
        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(loginResponse));
        response.getWriter().flush();
        log.info("----Filter End: 로그인 성공 핸들러 끝-----");
    }

    //로그인 실패시 실행
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        //unsuccessfulAuthentication에서 발생한 예외는 별도로 AuthenticationEntryPoint로 전달되지 않음
        //이 메서드는 로그인 실패 자체를 처리하기 때문에,
        // 만약 여기서 예외가 발생해도 다른 예외 처리 메커니즘(AuthenticationEntryPoint 등)이 호출되지 않는다.
        log.info("----Filter Start: 로그인 실패 핸들러 진행-----");
        failed.printStackTrace();
        // 예외 처리 로직을 공통 메서드로 위임
        ErrorHandler.handleAuthenticationException(response, failed);
        log.info("----Filter End: 로그인 실패 핸들러 끝-----");
    }
}