package com.resengkor.management.global.util;

import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class RoleJWTUtil {
    private final JWTUtil jwtUtil;
    private final RedisUtil redisUtil;

    public TokenResponse changeJWT(String oldAccessToken, User user) {
        boolean isAuto = jwtUtil.getIsAuto(oldAccessToken);
        String email = user.getEmail();
        String role = user.getRole().toString();
        long userId = user.getId();
        String sessionId = jwtUtil.getSessionId(oldAccessToken);

        // Access Token 및 Refresh Token 생성
        long accessTokenExpiration = 60 * 60 * 1000L; // 1시간
        long refreshTokenExpiration = 30 * 24 * 60 * 60 * 1000L; // 30일
        String newAccessToken = jwtUtil.createJwt("Authorization", "local", email, userId, role, accessTokenExpiration, isAuto, sessionId);
        String newRefreshToken = jwtUtil.createJwt("Refresh", "local", email, userId, role, refreshTokenExpiration, isAuto, sessionId);

        // Refresh Token Redis 저장
        String redisKey = "refresh_token:" + email + ":" + sessionId;
        boolean isStored = redisUtil.setData(redisKey, newRefreshToken, refreshTokenExpiration, TimeUnit.MILLISECONDS);
        if (!isStored) {
            log.error("JWT 재발급 중 Refresh Token 저장 실패");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }

        int expire = (int)refreshTokenExpiration/1000;

        return new TokenResponse(newAccessToken, newRefreshToken, expire);
    }
}
