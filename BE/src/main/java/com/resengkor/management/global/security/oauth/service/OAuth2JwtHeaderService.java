package com.resengkor.management.global.security.oauth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.jwt.dto.LoginResponse;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.util.CookieUtil;
import com.resengkor.management.global.util.RedisUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * OAuth2 리다이렉트 문제로 access 토큰을 httpOnly 쿠키로 발급
 * -> 프론트에서 바로 재요청하면 해당 access 토큰 헤더에 싣고, 쿠키는 만료시킴
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OAuth2JwtHeaderService {
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final RedisUtil redisUtil;
    
    private final long ACCESS_TOKEN_EXPIRATION = 60 * 60 * 1000L; // 1시간
    private final long REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000L; // 30일

    public void oauth2JwtHeaderSet(HttpServletRequest request, HttpServletResponse response) {
        log.info("------Service Start : OAuth 쿠키-> access 발급 서비스---------");

        Cookie[] cookies = request.getCookies();
        String access = null;

        if (cookies == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("Authorization")) {
                access = cookie.getValue();
            }
        }

        if (access == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 기존 Authorization 쿠키 제거
        response.addCookie(CookieUtil.createCookie("Authorization", null, 0));
        
        // JWT에서 userId 추출
        Long userId = jwtUtil.getUserId(access);
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        // 새로운 토큰 생성
        String sessionId = UUID.randomUUID().toString();
        String newAccessToken = jwtUtil.createJwt("Authorization", "oauth", loginUser.getEmail(), userId, loginUser.getRole().getRole(), ACCESS_TOKEN_EXPIRATION, false, sessionId);
        String refreshToken = jwtUtil.createJwt("Refresh", "oauth", loginUser.getEmail(), userId, loginUser.getRole().getRole(), REFRESH_TOKEN_EXPIRATION, false, sessionId);
        
        // Refresh 토큰을 Redis에 저장
        String redisKey = "refresh_token:" + loginUser.getEmail() + ":" + sessionId;
        boolean isStored = redisUtil.setData(redisKey, refreshToken, REFRESH_TOKEN_EXPIRATION, TimeUnit.MILLISECONDS);
        if (!isStored) {
            log.error("소셜 로그인 성공: Refresh 토큰 Redis 저장 실패");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        log.info("Refresh토큰 Redis 저장 성공");
        
        // accessToken 쿠키 생성 및 추가
        Cookie accessTokenCookie = new Cookie("accessToken", newAccessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge((int) (ACCESS_TOKEN_EXPIRATION / 1000));
        response.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("Refresh", null);
        refreshTokenCookie.setMaxAge(0);
        refreshTokenCookie.setPath("/");  // ✅ 경로 확인
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);  // 🔥 로컬 테스트 시 false (배포 시 true)
        refreshTokenCookie.setAttribute("SameSite", "None");  // ✅ 추가
        response.addCookie(refreshTokenCookie);
        
        // JSON 응답 설정
        LoginResponse loginResponse = LoginResponse.builder()
                .id(userId)
                .email(loginUser.getEmail())
                .emailStatus(loginUser.isEmailStatus())
                .temporaryPasswordStatus(loginUser.isTemporaryPasswordStatus())
                .companyName(loginUser.getCompanyName())
                .representativeName(loginUser.getRepresentativeName())
                .phoneNumber(loginUser.getPhoneNumber())
                .phoneNumberStatus(loginUser.isPhoneNumberStatus())
                .role(loginUser.getRole().getRole())
                .loginType(loginUser.getLoginType().toString())
                .status(loginUser.isStatus())
                .build();
        
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            response.setContentType("application/json;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString(loginResponse));
            response.getWriter().flush();
        } catch (IOException e) {
            log.error("OAuth Header service 오류 발생", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}