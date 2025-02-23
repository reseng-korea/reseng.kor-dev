package com.resengkor.management.global.security.jwt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.util.CookieUtil;
import com.resengkor.management.global.util.RedisUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReissueService {
    private final JWTUtil jwtUtil;
    private final RedisUtil redisUtil;
    private final UserRepository userRepository;
    private final long ACCESS_TOKEN_EXPIRATION = 60 * 60 * 1000L; // 1시간

    public CommonResponse reissue(HttpServletRequest request, HttpServletResponse response) {
        log.info("----Service Start: refresh 재발급 요청-----");

        // 1. AccessToken 검증 및 사용자 정보 추출
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_HEADER);
        }

        String accessToken = authorizationHeader.substring(7);
        String email = jwtUtil.getEmail(accessToken);
        String sessionId = jwtUtil.getSessionId(accessToken);

        if (email == null || sessionId == null) {
            throw new CustomException(ExceptionStatus.TOKEN_PARSE_ERROR);
        }

        // 2. Redis에서 RefreshToken 조회
        String redisKey = "refresh_token:" + email + ":" + sessionId;
        String refreshToken = redisUtil.getData(redisKey);

        if (refreshToken == null) {
            throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_DB);
        }

        // 3. RefreshToken 검증
        try {
            jwtUtil.isExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            throw new CustomException(ExceptionStatus.REFRESH_TOKEN_EXPIRED);
        }

        String category = jwtUtil.getCategory(refreshToken);
        if (!"Refresh".equals(category)) {
            throw new CustomException(ExceptionStatus.TOKEN_IS_NOT_REFRESH);
        }

        // 4. 사용자 정보 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

        if (!user.isStatus()) {
            throw new CustomException(ExceptionStatus.ACCOUNT_DISABLED);
        }

        long userId = user.getId();
        String role = user.getRole().toString();
        String loginType = jwtUtil.getLoginType(refreshToken);

        // 5. RefreshToken 만료 시간 설정
        long refreshTokenExpiration;
        String newAccessToken;
        String newRefreshToken;

        if (loginType.equals("local")) {
            boolean isAuto = jwtUtil.getIsAuto(refreshToken);
            Long remainingTTL = redisUtil.getRemainingTTL(redisKey);

            if (remainingTTL == -1L) {
                throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_DB);
            }

            refreshTokenExpiration = isAuto ? remainingTTL : 24 * 60 * 60 * 1000L; // 24시간

            // 새로운 AccessToken 및 RefreshToken 발급
            newAccessToken = jwtUtil.createJwt("Authorization", "local", email, userId, role, ACCESS_TOKEN_EXPIRATION, isAuto, sessionId);
            newRefreshToken = jwtUtil.createJwt("Refresh", "local", email, userId, role, refreshTokenExpiration, isAuto, sessionId);

        } else { // 소셜 로그인
            refreshTokenExpiration =  24 * 60 * 60 * 1000L; // 30일
            newAccessToken = jwtUtil.createOuathJwt("Authorization", "social", email, userId, role, ACCESS_TOKEN_EXPIRATION, sessionId);
            newRefreshToken = jwtUtil.createOuathJwt("Refresh", "social", email, userId, role, refreshTokenExpiration, sessionId);
        }

        // 6. 기존 RefreshToken 삭제 후 새 RefreshToken 저장
        boolean isDeleted = redisUtil.deleteData(redisKey);
        if (!isDeleted) {
            log.error("ReissueService: 기존 Refresh 토큰 삭제 실패 (Redis 연결 오류)");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }

        boolean isSaved = redisUtil.setData(redisKey, newRefreshToken, refreshTokenExpiration, TimeUnit.MILLISECONDS);
        if (!isSaved) {
            log.error("ReissueService: 새로운 Refresh 토큰 저장 실패 (Redis 연결 오류)");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }

        // 7. 응답 설정 (새로운 AccessToken 및 RefreshToken 전달)
        response.setHeader("Authorization", "Bearer " + newAccessToken);
        response.addCookie(CookieUtil.createCookie("Refresh", newRefreshToken, (int) (refreshTokenExpiration / 1000)));

        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage());
    }
}
