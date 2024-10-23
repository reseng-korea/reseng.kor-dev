package com.resengkor.management.global.security.jwt.service;

import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.ResponseStatus;
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

    public CommonResponse reissue(HttpServletRequest request, HttpServletResponse response) {
        // 헤더에서 refresh키에 담긴 토큰을 꺼냄
        String refresh = null;
        refresh = request.getHeader("Refresh");

        // 헤더에 refresh 토큰 x
        if (refresh == null) {
            throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_HEADER);
        }

        // 만료된 토큰은 payload 읽을 수 없음 -> ExpiredJwtException 발생
        try {
            jwtUtil.isExpired(refresh);
        } catch(ExpiredJwtException e){
            throw new CustomException(ExceptionStatus.REFRESH_TOKEN_EXPIRED);
        }

        // refresh 토큰이 아님
        String category = jwtUtil.getCategory(refresh);
        if(!category.equals("Refresh")) {
            throw new CustomException(ExceptionStatus.EXCEPTION);
        }

        String email = jwtUtil.getEmail(refresh);
        String role = jwtUtil.getRole(refresh);
        boolean isAuto = jwtUtil.getIsAuto(refresh);

        // refresh DB 조회
        Boolean isExist = refreshRepository.existsByRefresh(refresh);
        RefreshToken refreshToken = refreshRepository.findByRefresh(refresh).orElseThrow();

        // DB 에 없는 리프레시 토큰 (혹은 블랙리스트 처리된 리프레시 토큰)
        if(!isExist) {
            throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND);
        }

        long refreshTokenExpiration;
        if(isAuto){
            // 로그인 유지 기능
            // isAuto가 true인 경우에만 남은 기간을 계산하여 새로 발급
            try {
                //함수가 시간을 넘겨야해서 다시 이전 refresh 유효기간을 그대로 넘기지x
                Date now = new Date();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 날짜 형식
                Date tokenExpiration = sdf.parse(refreshToken.getExpiration()); // ParseException 발생 가능
                long remainingTimeMs = tokenExpiration.getTime() - now.getTime();

                // 만료 시간이 지났다면 재발급 불가 (로그인 유지 한 달이 만료됨)
                if (remainingTimeMs <= 0) {
                    throw new CustomException(ExceptionStatus.REFRESH_TOKEN_EXPIRED);
                }
                // 남은 기간만큼 새 Refresh Token 발급
                refreshTokenExpiration = remainingTimeMs;

            } catch (ParseException e) {
                // parse에 실패한 경우 처리
                throw new CustomException(ExceptionStatus.TOKEN_PARSE_ERROR);
            }
        }
        else{
            refreshTokenExpiration = 60 * 60 * 24 * 1000L;
        }

        // new tokens
        String newAccess = jwtUtil.createJwt("access", email, role, ACCESS_TOKEN_EXPIRATION,isAuto);
        String newRefresh = jwtUtil.createJwt("Refresh", email, role, refreshTokenExpiration,isAuto);

        // 기존 refresh DB 삭제, 새로운 refresh 저장
        refreshRepository.deleteByRefresh(refresh);
        refreshTokenService.saveRefresh(email, (int) (refreshTokenExpiration / 1000L), newRefresh);

        //헤더로 전해줌
        response.setHeader("Authorization", "Bearer " + newAccess);
        response.setHeader("Refresh", newRefresh);

        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS .getCode(),
                ResponseStatus.RESPONSE_SUCCESS .getMessage());
    }
}
