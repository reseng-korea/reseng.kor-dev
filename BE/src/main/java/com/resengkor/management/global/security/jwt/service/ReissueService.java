package com.resengkor.management.global.security.jwt.service;

import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.jwt.entity.RefreshToken;
import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.util.RedisUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReissueService {
    private final JWTUtil jwtUtil;
    private final RedisUtil redisUtil;
//    private final RefreshRepository refreshRepository;
    private final RefreshTokenService refreshTokenService;
    private final long ACCESS_TOKEN_EXPIRATION= 60 * 30 * 1000L;
    private final UserRepository userRepository;

    public CommonResponse reissue(HttpServletRequest request, HttpServletResponse response) {
        // 헤더에서 refresh키에 담긴 토큰을 꺼냄
        String refresh = request.getHeader("Refresh");
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
        long userId = user.getId();
        String role = jwtUtil.getRole(refresh);
        String loginType = jwtUtil.getLoginType(refresh);


        long refreshTokenExpiration;
        String newAccess;
        String newRefresh;

        // Redis에서 refresh 토큰 유효성 검사
        Boolean isExist = redisUtil.existData("refresh:token:" + refresh);

        if(loginType.equals("local")){
            boolean isAuto = jwtUtil.getIsAuto(refresh);
            Long remainingTTL = redisUtil.getRemainingTTL("refresh:token:" + refresh);

            // DB 에 없는 리프레시 토큰 (혹은 블랙리스트 처리된 리프레시 토큰)
            if(!isExist || remainingTTL == null || remainingTTL <= 0) {
                throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_DB);
            }

            if(isAuto) {
                // 남은 기간만큼 새 Refresh Token 발급
                refreshTokenExpiration = remainingTTL; // Redis에서 가져온 남은 TTL을 사용
            } else {
                refreshTokenExpiration = 60 * 60 * 24 * 1000L; // 24시간
            }

            // new tokens
            newAccess = jwtUtil.createJwt("Authorization", "local",email, userId, role, ACCESS_TOKEN_EXPIRATION,isAuto);
            newRefresh = jwtUtil.createJwt("Refresh", email, "local", userId, role, refreshTokenExpiration,isAuto);


        }
        else { //소셜
            // DB 에 없는 리프레시 토큰 (혹은 블랙리스트 처리된 리프레시 토큰)
            if(!isExist) {
                throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_DB);
            }
            refreshTokenExpiration = 30 * 60 * 60 * 24 * 1000L; // 30일
            newAccess = jwtUtil.createOuathJwt("Authorization", "social", email, userId, role, ACCESS_TOKEN_EXPIRATION);
            newRefresh = jwtUtil.createOuathJwt("Refresh", "social", email, userId, role, refreshTokenExpiration);
        }

        // 기존 refresh DB 삭제, 새로운 refresh 저장
        // 기존 refresh 키 삭제
        redisUtil.deleteData("refresh:token:" + refresh);
        // Redis에 새로운 Refresh Token 저장
        redisUtil.setData("refresh:token:" + newRefresh, newRefresh, refreshTokenExpiration, TimeUnit.MILLISECONDS);


        //헤더로 전해줌
        response.setHeader("Authorization", "Bearer " + newAccess);
        response.setHeader("Refresh", newRefresh);

        log.info("------------------------------------------------");
        log.info("ReissueService 성공");
        log.info("------------------------------------------------");

        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS .getCode(),
                ResponseStatus.RESPONSE_SUCCESS .getMessage());
    }
}
