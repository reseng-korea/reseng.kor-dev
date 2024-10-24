package com.resengkor.management.global.security.oauth.service;

import com.resengkor.management.global.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

/**
 * OAuth2 리다이렉트 문제로 access 토큰을 httpOnly 쿠키로 발급
 * -> 프론트에서 바로 재요청하면 해당 access 토큰 헤더에 싣고, 쿠키는 만료시킴
 */
@Service
public class OAuth2JwtHeaderService {
    public String oauth2JwtHeaderSet(HttpServletRequest request, HttpServletResponse response) {
        System.out.println("OAuth2USer header");

        Cookie[] cookies = request.getCookies();
        String access = null;
        String refresh = null;

        if(cookies == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return "bad";
        }
        for (Cookie cookie : cookies) {
            if(cookie.getName().equals("access")){
                access = cookie.getValue();
            }
        }
        for (Cookie cookie : cookies) {
            if(cookie.getName().equals("refresh")){
                refresh = cookie.getValue();
            }
        }

        if(access == null || refresh == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return "bad";
        }

        // 클라이언트의 access 토큰 쿠키를 만료
        response.addCookie(CookieUtil.createCookie("access", null, 0));
        response.addCookie(CookieUtil.createCookie("refresh", null, 0));
        response.addHeader("Authorization", access);
        response.addHeader("Refresh", access);
        response.setStatus(HttpServletResponse.SC_OK);

        return "success";
    }
}