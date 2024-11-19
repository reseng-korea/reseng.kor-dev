package com.resengkor.management.global.security.oauth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.jwt.dto.LoginResponse;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import com.resengkor.management.global.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * OAuth2 리다이렉트 문제로 access 토큰을 httpOnly 쿠키로 발급
 * -> 프론트에서 바로 재요청하면 해당 access 토큰 헤더에 싣고, 쿠키는 만료시킴
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class OAuth2JwtHeaderService {
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    public void oauth2JwtHeaderSet(HttpServletRequest request, HttpServletResponse response) {
        log.info("------Service Start : OAuth 쿠키-> access 발급 서비스---------");

        Cookie[] cookies = request.getCookies();
        String access = null;

        if(cookies == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        for (Cookie cookie : cookies) {
            if(cookie.getName().equals("Authorization")){
                access = cookie.getValue();
            }
        }

        if(access == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 클라이언트의 access 토큰 쿠키를 만료
        response.addCookie(CookieUtil.createCookie("Authorization", null, 0));
        log.info("------------------------------------------------");
        log.info("OAuth2JwtHeaderService - Authorization : {}",access);
        log.info("------------------------------------------------");
        response.addHeader("Authorization", "Bearer " + access);
        response.setStatus(HttpServletResponse.SC_OK);

        Long userId = jwtUtil.getUserId(access);
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        //응답 생성
        LoginResponse loginResponse = LoginResponse.builder()
                .id(userId)
                .email(loginUser.getEmail())
                .emailStatus(loginUser.isEmailStatus())
                .temporaryPasswordStatus(loginUser.isTemporaryPasswordStatus())
                .companyName(loginUser.getCompanyName())
                .representativeName(loginUser.getRepresentativeName())
                .phoneNumber(loginUser.getPhoneNumber())
                .phoneNumberStatus(loginUser.isPhoneNumberStatus())
                .role(loginUser.getRole().getRole())
                .loginType(loginUser.getLoginType().toString())
                .status(loginUser.isStatus())
                .build();

        // 응답 출력
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            response.getWriter().write(objectMapper.writeValueAsString(loginResponse));
            response.getWriter().flush();
        } catch (IOException e) {
            log.error("OAuth Header service 오류 발생", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}