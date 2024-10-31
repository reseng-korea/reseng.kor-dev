package com.resengkor.management.global.security.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.jwt.dto.CustomUserDetails;
import com.resengkor.management.global.security.jwt.dto.LoginDTO;
//import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
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
//    private final RefreshRepository refreshRepository;
    private final long ACCESS_TOKEN_EXPIRATION= 60 * 30 * 1000L; //30분

    public CustomLoginFilter(String defaultFilterUrl, AuthenticationManager authenticationManager, JWTUtil jwtUtil, RedisUtil redisUtil) {
        setFilterProcessesUrl(defaultFilterUrl);
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.redisUtil = redisUtil;
    }

    //실제 로그인 진행 메소드
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        log.info("------------------------------------------------");
        log.info("로그인 시작");
        log.info("------------------------------------------------");

        // 메서드가 POST인지 확인
        if (!request.getMethod().equalsIgnoreCase("POST")) {
            // POST가 아닌 요청인 경우 405 에러 반환
            response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            try {
                response.getWriter().write("{\"error\": \"POST method only allowed for login\"}");
                response.getWriter().flush();
            } catch (IOException e) {
                log.error("Response writing error", e);
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
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        log.info("------------------------------------------------");
        log.info("로그인 성공해서 로그인 성공 핸들러 동작");
        log.info("------------------------------------------------");

        //1. authentication에서 유저 정보를 가져오자.
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        String email = customUserDetails.getUsername();
        long userId = customUserDetails.getUserId();
        log.info("------------------------------------------------");
        log.info("email = {}, userId = {}",email,userId);
        log.info("------------------------------------------------");

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
        String access = jwtUtil.createJwt("Authorization", "local", email, userId, role, ACCESS_TOKEN_EXPIRATION,isAuto);
        String refresh = jwtUtil.createJwt("Refresh", "local", email, userId, role, refreshTokenExpiration,isAuto);

        //2-1. Refresh 토큰 DB에 저장 메소드
//        addRefreshEntity(email, refresh, refreshTokenExpiration);
        redisUtil.setData("refresh:token:" + email, refresh, refreshTokenExpiration, TimeUnit.MILLISECONDS);
        log.info("------------------------------------------------");
        log.info("Refresh토큰 DB에 저장 성공");
        log.info("------------------------------------------------");

        // 3. JSON 응답 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpStatus.OK.value());

        response.setHeader("Authorization", "Bearer " + access);
        response.setHeader("Refresh", refresh);

        // 응답 JSON 생성
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("userId", userId);

        // 응답 출력
        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(responseBody));
        response.getWriter().flush();
    }

    //Refresh 토큰 DB에 저장 메소드
//    private void addRefreshEntity(String email, String refresh, Long expiredMs) {
//        Date date = new Date(System.currentTimeMillis() + expiredMs);
//        RefreshToken refreshToken = RefreshToken.builder()
//                .email(email)
//                .refresh(refresh)
//                .expiration(date.toString())
//                .build();
//        refreshRepository.save(refreshToken);
//    }

    //로그인 실패시 실행
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        //unsuccessfulAuthentication에서 발생한 예외는 별도로 AuthenticationEntryPoint로 전달되지 않음
        //이 메서드는 로그인 실패 자체를 처리하기 때문에,
        // 만약 여기서 예외가 발생해도 다른 예외 처리 메커니즘(AuthenticationEntryPoint 등)이 호출되지 않는다.
        log.info("------------------------------------------------");
        log.info("로그인 실패");
        log.info("------------------------------------------------");
        // HTTP 상태 코드와 Content-Type 설정
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json; charset=UTF-8");

        String errorMessage;

        // 예외 종류에 따른 오류 메시지 설정
        if (failed instanceof BadCredentialsException) {
            errorMessage = "아이디 또는 비밀번호가 잘못되었습니다.";
        } else if (failed instanceof DisabledException) {
            errorMessage = "계정이 비활성화되었습니다. 관리자에게 문의하세요.";
        } else if (failed instanceof LockedException) {
            errorMessage = "계정이 잠겼습니다. 관리자에게 문의하세요.";
        } else if (failed instanceof AccountExpiredException) {
            errorMessage = "계정이 만료되었습니다. 관리자에게 문의하세요.";
        } else if (failed instanceof CredentialsExpiredException) {
            errorMessage = "비밀번호가 만료되었습니다. 비밀번호를 재설정하세요.";
        } else {
            errorMessage = "로그인에 실패했습니다. 자격 증명을 확인하세요.";
        }

        // JSON 형식으로 오류 메시지 반환
        response.getWriter().write("{\"error\": \"" + errorMessage + "\"}");
        response.getWriter().flush();
    }
}