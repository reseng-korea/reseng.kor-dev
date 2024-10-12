package com.resengkor.management.global.security.jwt.service;

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

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class ReissueService {
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final RefreshTokenService refreshTokenService;

    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        // 헤더에서 refresh키에 담긴 토큰을 꺼냄
        String refresh = null;
        refresh = request.getHeader("Refresh");


//        String refresh = null;
//        Cookie[] cookies = request.getCookies();
//
//        refresh = Arrays.stream(cookies).filter((cookie) -> cookie.getName().equals("refresh"))
//                .findFirst().get().getValue();

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

        // refresh DB 조회
        Boolean isExist = refreshRepository.existsByRefresh(refresh);

        // DB 에 없는 리프레시 토큰 (혹은 블랙리스트 처리된 리프레시 토큰)
        if(!isExist) {
            return new ResponseEntity<>("invalid Refresh token", HttpStatus.BAD_REQUEST);
        }

        // new tokens
        String newAccess = jwtUtil.createJwt("access", email, role, 60 * 10 * 1000L);
        Integer expiredS = 60 * 60 * 24;
        String newRefresh = jwtUtil.createJwt("Refresh", email, role, expiredS * 1000L);

        // 기존 refresh DB 삭제, 새로운 refresh 저장
        refreshRepository.deleteByRefresh(refresh);
        refreshTokenService.saveRefresh(email, expiredS, newRefresh);

        //헤더로 전해줌
        response.setHeader("access", newAccess);
        response.setHeader("Refresh", newRefresh);
//        response.addCookie(CookieUtil.createCookie("refresh", newRefresh, expiredS));

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
