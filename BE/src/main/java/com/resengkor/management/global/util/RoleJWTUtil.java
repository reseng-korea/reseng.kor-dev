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

    public String changeJWT(String oldAccessToken, User user) {
        boolean isAuto = jwtUtil.getIsAuto(oldAccessToken);
        String email = user.getEmail();
        String role = user.getRole().toString();
        long userId = user.getId();
        String sessionId = jwtUtil.getSessionId(oldAccessToken);

        // Access Token 및 Refresh Token 생성
        long accessTokenExpiration = 60 * 60 * 1000L; // 1시간
        String newAccessToken = jwtUtil.createJwt("Authorization", "local", email, userId, role, accessTokenExpiration, isAuto, sessionId);

        return newAccessToken;
    }
}
