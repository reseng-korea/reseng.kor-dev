package com.resengkor.management.global.security.jwt.service;

import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
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
    private final long ACCESS_TOKEN_EXPIRATION= 60 * 60 * 1000L; //1시간
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
        log.info("user 찾기 성공");
        // 비활성화된 user면 에러 던짐
        if (!user.isStatus()) {
            log.info("비활성 사용자입니다");
            throw new CustomException(ExceptionStatus.ACCOUNT_DISABLED); // 비활성 사용자 예외
        }

        long userId = user.getId();
        String role = jwtUtil.getRole(refresh);
        String loginType = jwtUtil.getLoginType(refresh);
        log.info("role = {}, loginType = {}", role, loginType);


        long refreshTokenExpiration;
        String newAccess;
        String newRefresh;

        // Redis에서 refresh 토큰 유효성 검사
        Boolean isExist = redisUtil.existData("refresh:token:" + refresh);
        log.error("refreshKey : {}", refresh);

        if(loginType.equals("local")){
            boolean isAuto = jwtUtil.getIsAuto(refresh);
            Long remainingTTL = redisUtil.getRemainingTTL("refresh:token:" + refresh);

            // DB 에 없는 리프레시 토큰 (혹은 블랙리스트 처리된 리프레시 토큰)
            if(!isExist || remainingTTL == -1L) {
                log.error("isExist  = {}, remiainingTTL  = {}", isExist, remainingTTL);
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
        boolean isDeleted = redisUtil.deleteData("refresh:token:" + refresh);
        if (!isDeleted) {
            log.error("ReissueService: Refresh 토큰 삭제 실패 (Redis 연결 오류)");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }
        // Redis에 새로운 Refresh Token 저장
        boolean isSaved = redisUtil.setData("refresh:token:" + newRefresh, newRefresh, refreshTokenExpiration, TimeUnit.MILLISECONDS);
        if (!isSaved) {
            log.error("ReissueService: Refresh 토큰 저장 실패 (Redis 연결 오류)");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }


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
