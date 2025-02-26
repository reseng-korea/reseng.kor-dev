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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * OAuth2 로그인 후 Access Token은 쿠키에 저장,
 * Refresh Token은 Redis에 저장하여 보안 강화
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
        log.info("------ OAuth2 로그인 후 JWT 처리 시작 ---------");

        // ✅ 1. 쿠키에서 Access Token 가져오기
        String accessToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }

        // ✅ 2. Access Token이 없거나 만료되었으면 새로 발급
        Long userId;
        if (accessToken == null || !jwtUtil.validateToken(accessToken)) {
            log.info("Access Token이 없거나 만료됨, 새로 발급");

            // 기존 쿠키 삭제
            response.addCookie(CookieUtil.createCookie("accessToken", null, 0));

            // 새 Access & Refresh Token 생성
            String sessionId = UUID.randomUUID().toString();
            User loginUser = createNewTokens(response, sessionId);
            if (loginUser == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            userId = loginUser.getId();
        } else {
            userId = jwtUtil.getUserId(accessToken);
        }

        // ✅ 3. 사용자 조회
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        // ✅ 4. 응답 JSON 생성
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
                .loginType(loginUser.getLoginType().toUpperCase()) // 대문자로 변환
                .status(loginUser.isStatus())
                .build();

        // ✅ 5. JSON 응답 반환
        sendJsonResponse(response, loginResponse);
    }

    /**
     * 새 Access Token & Refresh Token을 발급하고 쿠키와 Redis에 저장
     */
    private User createNewTokens(HttpServletResponse response, String sessionId) {
        // 임의의 사용자 조회 (테스트용, 실제 환경에서는 인증된 사용자 정보를 가져와야 함)
        User loginUser = userRepository.findById(1L) // ❗ 여기를 적절히 수정 (OAuth2 로그인 유저 찾기)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        String email = loginUser.getEmail();
        String role = loginUser.getRole().getRole();

        // 새로운 JWT 발급
        String newAccessToken = jwtUtil.createJwt("Authorization", "oauth2", email, loginUser.getId(), role, ACCESS_TOKEN_EXPIRATION, false, sessionId);
        String newRefreshToken = jwtUtil.createJwt("Refresh", "oauth2", email, loginUser.getId(), role, REFRESH_TOKEN_EXPIRATION, false, sessionId);

        // ✅ Refresh Token을 Redis에 저장
        String redisKey = "refresh_token:" + email + ":" + sessionId;
        boolean isStored = redisUtil.setData(redisKey, newRefreshToken, REFRESH_TOKEN_EXPIRATION, TimeUnit.MILLISECONDS);
        if (!isStored) {
            log.error("OAuth2 로그인 성공: Refresh 토큰 Redis 저장 실패");
            return null;
        }
        log.info("OAuth2 Refresh 토큰 Redis 저장 성공");

        // ✅ Access Token을 쿠키로 저장
        response.addCookie(CookieUtil.createCookie("accessToken", newAccessToken, (int) ACCESS_TOKEN_EXPIRATION / 1000));

        return loginUser;
    }

    /**
     * JSON 응답 반환 메서드
     */
    private void sendJsonResponse(HttpServletResponse response, LoginResponse loginResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            response.setContentType("application/json;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpStatus.OK.value());
            response.getWriter().write(objectMapper.writeValueAsString(loginResponse));
            response.getWriter().flush();
        } catch (IOException e) {
            log.error("OAuth2 JWT 발급 오류", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
