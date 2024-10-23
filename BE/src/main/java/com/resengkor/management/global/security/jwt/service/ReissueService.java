package com.resengkor.management.global.security.jwt.service;

import com.resengkor.management.global.security.jwt.entity.RefreshToken;
import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.util.CookieUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class ReissueService {
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final RefreshTokenService refreshTokenService;
    private final long ACCESS_TOKEN_EXPIRATION= 60 * 10 * 1000L;

    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        // 헤더에서 refresh키에 담긴 토큰을 꺼냄
        String refresh = null;
        refresh = request.getHeader("Refresh");

        // 헤더에 refresh 토큰 x
        if (refresh == null) {
            return new ResponseEntity<>("Refresh token is null", HttpStatus.BAD_REQUEST);
        }

        // 만료된 토큰은 payload 읽을 수 없음 -> ExpiredJwtException 발생
        try {
            jwtUtil.isExpired(refresh);
        } catch(ExpiredJwtException e){
            return new ResponseEntity<>("Refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // refresh 토큰이 아님
        String category = jwtUtil.getCategory(refresh);
        if(!category.equals("Refresh")) {
            return new ResponseEntity<>("invalid Refresh token", HttpStatus.BAD_REQUEST);
        }

        String email = jwtUtil.getEmail(refresh);
        String role = jwtUtil.getRole(refresh);
        boolean isAuto = jwtUtil.getIsAuto(refresh);

        // refresh DB 조회
        Boolean isExist = refreshRepository.existsByRefresh(refresh);
        RefreshToken refreshToken = refreshRepository.findByRefresh(refresh).orElseThrow();

        // DB 에 없는 리프레시 토큰 (혹은 블랙리스트 처리된 리프레시 토큰)
        if(!isExist) {
            return new ResponseEntity<>("invalid Refresh token", HttpStatus.BAD_REQUEST);
        }

        long refreshTokenExpiration;
        if(isAuto){
            // 로그인 유지 기능
            // isAuto가 true인 경우에만 남은 기간을 계산하여 새로 발급
            try {
                Date now = new Date();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 날짜 형식
                Date tokenExpiration = sdf.parse(refreshToken.getExpiration()); // ParseException 발생 가능
                long remainingTimeMs = tokenExpiration.getTime() - now.getTime();

                // 만료 시간이 지났다면 재발급 불가 (로그인 유지 한 달이 만료됨)
                if (remainingTimeMs <= 0) {
                    return new ResponseEntity<>("Refresh token expired, please log in again", HttpStatus.UNAUTHORIZED);
                }

                // 남은 기간만큼 새 Refresh Token 발급
                refreshTokenExpiration = remainingTimeMs;

            } catch (ParseException e) {
                // parse에 실패한 경우 처리
                return new ResponseEntity<>("Invalid date format for refresh token expiration", HttpStatus.BAD_REQUEST);
            }
        }
        else{
            refreshTokenExpiration = 60L * 60L * 24L * 1000L;
        }

        // new tokens
        String newAccess = jwtUtil.createJwt("access", email, role, ACCESS_TOKEN_EXPIRATION,isAuto);
        String newRefresh = jwtUtil.createJwt("Refresh", email, role, refreshTokenExpiration,isAuto);

        // 기존 refresh DB 삭제, 새로운 refresh 저장
        refreshRepository.deleteByRefresh(refresh);
        refreshTokenService.saveRefresh(email, (int) (refreshTokenExpiration / 1000), newRefresh);

        //헤더로 전해줌
        response.setHeader("access", newAccess);
        response.setHeader("Refresh", newRefresh);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
