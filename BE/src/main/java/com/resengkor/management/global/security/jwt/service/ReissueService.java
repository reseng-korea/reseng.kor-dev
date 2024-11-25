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
    private final long ACCESS_TOKEN_EXPIRATION= 60 * 60 * 1000L; //1시간
    private final UserRepository userRepository;

    public CommonResponse reissue(HttpServletRequest request, HttpServletResponse response) {
        log.info("----Service Start: refresh 재발급 요청-----");

        // 1. 쿠키 꺼내기
        // 쿠키에서 refresh키에 담긴 토큰을 꺼냄
        Cookie[] cookies = request.getCookies();
        if(cookies == null){
            throw  new CustomException(ExceptionStatus.COOKIE_NOT_FOUND);
        }

        //쿠키에 담긴 oldRefresh 꺼냄
        String oldRefresh = null;
        for (Cookie cookie : cookies) {
            if(cookie.getName().equals("Refresh")){
                oldRefresh = cookie.getValue();
            }
        }
        if(oldRefresh == null){
            throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_COOKIE);
        }

        //2. refresh 검증
        // 만료된 토큰은 payload 읽을 수 없음 -> ExpiredJwtException 발생
        try {
            jwtUtil.isExpired(oldRefresh);
        } catch(ExpiredJwtException e){
            throw new CustomException(ExceptionStatus.REFRESH_TOKEN_EXPIRED);
        }

        // refresh 토큰이 아님
        String category = jwtUtil.getCategory(oldRefresh);
        if(!category.equals("Refresh")) {
            throw new CustomException(ExceptionStatus.TOKEN_IS_NOT_REFRESH);
        }


        String email = jwtUtil.getEmail(oldRefresh);
        String sessionId = jwtUtil.getSessionId(oldRefresh);
        String redisKey = "refresh_token:" + email + ":" + sessionId;

        // Redis에서 refresh 토큰 유효성 검사
        Boolean isExist = redisUtil.existData(redisKey);
        String redisRefresh;
        if(isExist){//Redis에 존재한다면
            //redis에 있는 value값 가져오기
            redisRefresh = redisUtil.getData(redisKey);
            if(!oldRefresh.equals(redisRefresh)){
                throw new CustomException(ExceptionStatus.INVALID_REFRESH_TOKEN);
            }
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));
        log.info("user 찾기 성공");
        // 비활성화된 user면 에러 던짐
        if (!user.isStatus()) {
            log.info("비활성 사용자입니다");
            throw new CustomException(ExceptionStatus.ACCOUNT_DISABLED); // 비활성 사용자 예외
        }

        long userId = user.getId();
        String role = jwtUtil.getRole(oldRefresh);
        String loginType = jwtUtil.getLoginType(oldRefresh);

        long refreshTokenExpiration;
        String newAccess;
        String newRefresh;


        if(loginType.equals("local")){
            boolean isAuto = jwtUtil.getIsAuto(oldRefresh);
            Long remainingTTL = redisUtil.getRemainingTTL(redisKey);

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
            newAccess = jwtUtil.createJwt("Authorization", "local",email, userId, role, ACCESS_TOKEN_EXPIRATION,isAuto,sessionId);
            newRefresh = jwtUtil.createJwt("Refresh", email, "local", userId, role, refreshTokenExpiration,isAuto,sessionId);


        }
        else { //소셜
            // DB 에 없는 리프레시 토큰 (혹은 블랙리스트 처리된 리프레시 토큰)
            if(!isExist) {
                throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_DB);
            }
            refreshTokenExpiration = 30 * 60 * 60 * 24 * 1000L; // 30일
            newAccess = jwtUtil.createOuathJwt("Authorization", "social", email, userId, role, ACCESS_TOKEN_EXPIRATION,sessionId);
            newRefresh = jwtUtil.createOuathJwt("Refresh", "social", email, userId, role, refreshTokenExpiration,sessionId);
        }

        // 기존 refresh DB 삭제, 새로운 refresh 저장
        boolean isDeleted = redisUtil.deleteData(redisKey); //해당 기기에 해당하는 refresh만 삭제
        if (!isDeleted) {
            log.error("ReissueService: Refresh 토큰 삭제 실패 (Redis 연결 오류)");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }
        // Redis에 새로운 Refresh Token 저장
        boolean isSaved = redisUtil.setData(redisKey, newRefresh, refreshTokenExpiration, TimeUnit.MILLISECONDS);
        if (!isSaved) {
            log.error("ReissueService: Refresh 토큰 저장 실패 (Redis 연결 오류)");
            throw new CustomException(ExceptionStatus.DB_CONNECTION_ERROR);
        }


        //access는 헤더로 전해줌
        response.setHeader("Authorization", "Bearer " + newAccess);
        //refresh는 쿠키로 전해줌
        response.addCookie(CookieUtil.createCookie("Refresh", newRefresh, (int)refreshTokenExpiration/1000));

        return new CommonResponse(ResponseStatus.RESPONSE_SUCCESS .getCode(),
                ResponseStatus.RESPONSE_SUCCESS .getMessage());
    }
}
