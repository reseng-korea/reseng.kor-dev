package com.resengkor.management.global.security.jwt.service;

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
import jakarta.servlet.http.Cookie;
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
    private final long ACCESS_TOKEN_EXPIRATION = 60 * 60 * 1000L; // 1시간
    private final UserRepository userRepository;

    public CommonResponse reissue(HttpServletRequest request, HttpServletResponse response, String accessToken) {
        log.info("----Service Start: Refresh 재발급 요청-----");

        // ✅ 1. Access Token 검증 (프론트에서 받음)
        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            throw new CustomException(ExceptionStatus.INVALID_ACCESS_TOKEN);
        }
        accessToken = accessToken.substring(7); // "Bearer " 제거

        String email;
        String sessionId;
        try {
            email = jwtUtil.getEmail(accessToken);
            sessionId = jwtUtil.getSessionId(accessToken);
        } catch (Exception e) {
            throw new CustomException(ExceptionStatus.INVALID_ACCESS_TOKEN);
        }

        // ✅ 2. Redis에서 Refresh Token 확인
        String redisKey = "refresh_token:" + email + ":" + sessionId;
        if (!redisUtil.existData(redisKey)) {
            log.warn("Redis에서 Refresh Token 없음 -> 로그아웃 처리");
            return new CommonResponse(ExceptionStatus.LOGOUT_REQUIRED.getCode(), "로그아웃 필요", false);
        }

        String redisRefreshToken = redisUtil.getData(redisKey);
        if (!jwtUtil.validateToken(redisRefreshToken)) {
            log.warn("Refresh Token이 만료됨 -> 로그아웃 처리");
            redisUtil.deleteData(redisKey);
            return new CommonResponse(ExceptionStatus.LOGOUT_REQUIRED.getCode(), "로그아웃 필요", false);
        }

        // ✅ 3. 쿠키에서 Refresh Token 가져오기
        String refreshTokenFromCookie = getRefreshTokenFromCookies(request);
        if (refreshTokenFromCookie == null) {
            throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_COOKIE);
        }

        // ✅ 4. 쿠키의 RefreshToken과 Redis의 RefreshToken 비교
        if (!refreshTokenFromCookie.equals(redisRefreshToken)) {
            throw new CustomException(ExceptionStatus.INVALID_REFRESH_TOKEN);
        }

        // ✅ 5. Refresh Token 유효성 검사
        try {
            jwtUtil.isExpired(refreshTokenFromCookie);
        } catch (ExpiredJwtException e) {
            throw new CustomException(ExceptionStatus.REFRESH_TOKEN_EXPIRED);
        }

        String category = jwtUtil.getCategory(refreshTokenFromCookie);
        if (!category.equals("Refresh")) {
            throw new CustomException(ExceptionStatus.TOKEN_IS_NOT_REFRESH);
        }

        // ✅ 6. 사용자 정보 조회 (기존 코드 유지)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
        log.info("user 찾기 성공");

        if (!user.isStatus()) {
            log.info("비활성 사용자입니다");
            throw new CustomException(ExceptionStatus.ACCOUNT_DISABLED);
        }

        long userId = user.getId();
        String role = user.getRole().toString();
        String loginType = jwtUtil.getLoginType(refreshTokenFromCookie);

        long refreshTokenExpiration;
        String newAccessToken;
        String newRefreshToken;

        if (loginType.equals("local")) {
            boolean isAuto = jwtUtil.getIsAuto(refreshTokenFromCookie);
            Long remainingTTL = redisUtil.getRemainingTTL(redisKey);

            if (!redisUtil.existData(redisKey) || remainingTTL == -1L) {
                log.error("isExist  = {}, remiainingTTL  = {}", redisUtil.existData(redisKey), remainingTTL);
                throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_DB);
            }

            refreshTokenExpiration = isAuto ? remainingTTL : 60 * 60 * 24 * 1000L; // 24시간
            newAccessToken = jwtUtil.createJwt("Authorization", "local", email, userId, role, ACCESS_TOKEN_EXPIRATION, isAuto, sessionId);
            newRefreshToken = jwtUtil.createJwt("Refresh", "local", email, userId, role, refreshTokenExpiration, isAuto, sessionId);
        } else { // 소셜 로그인
            if (!redisUtil.existData(redisKey)) {
                throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_DB);
            }
            refreshTokenExpiration = 30 * 60 * 60 * 24 * 1000L; // 30일
            newAccessToken = jwtUtil.createOuathJwt("Authorization", "social", email, userId, role, ACCESS_TOKEN_EXPIRATION, sessionId);
            newRefreshToken = jwtUtil.createOuathJwt("Refresh", "social", email, userId, role, refreshTokenExpiration, sessionId);
        }

        // ✅ 7. Redis에서 기존 Refresh 삭제 및 갱신
        boolean isDeleted = redisUtil.deleteData(redisKey);
        if (!isDeleted) {
            log.error("ReissueService: Refresh 토큰 삭제 실패 (Redis 연결 오류)");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }

        boolean isSaved = redisUtil.setData(redisKey, newRefreshToken, refreshTokenExpiration, TimeUnit.MILLISECONDS);
        if (!isSaved) {
            log.error("ReissueService: Refresh 토큰 저장 실패 (Redis 연결 오류)");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }

        // ✅ 8. 새로운 Access Token을 응답 헤더에 추가
        response.setHeader("Authorization", "Bearer " + newAccessToken);

        // ✅ 9. 새로운 Refresh Token을 `HttpOnly` 쿠키로 설정
        response.addHeader("Set-Cookie", createHttpOnlyCookie("refreshToken", newRefreshToken, refreshTokenExpiration));

        log.info("----Service End: Refresh 토큰 재발급 완료-----");
        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage());
    }

    // ✅ 쿠키에서 Refresh Token 가져오는 메서드 (기존 코드 변경)
    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "refreshToken".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    // ✅ HttpOnly Secure 쿠키 생성 메서드
    private String createHttpOnlyCookie(String name, String value, long maxAge) {
        return name + "=" + value + "; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=" + (maxAge / 1000);
    }
}
