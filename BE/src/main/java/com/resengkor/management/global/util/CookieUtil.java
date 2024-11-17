package com.resengkor.management.global.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.SerializationUtils;

import java.util.Base64;
import java.util.Optional;

public class CookieUtil {
    //프엔이랑 주고 받는 쿠키
    public static Cookie createCookie(String key, String value, Integer expiredS) {
        Cookie cookie = new Cookie(key, value);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(expiredS);
        cookie.setAttribute("SameSite", "None");
        cookie.setSecure(false);
        return cookie;
    }

    //내부에서 repository에 저장하는 쿠키(외부로 보내지 않음)
    /**
     * 요청에서 특정 이름의 쿠키를 가져옵니다.
     *
     * @param request HttpServletRequest
     * @param name    쿠키 이름
     * @return Optional<Cookie>
     */
    public static Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return Optional.of(cookie);
                }
            }
        }
        return Optional.empty();
    }

    /**
     * 응답에 쿠키를 추가합니다.
     *
     * @param response HttpServletResponse
     * @param name     쿠키 이름
     * @param value    쿠키 값
     * @param maxAge   쿠키 만료 시간 (초)
     */
    public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true); // HTTP-Only 속성 설정
        cookie.setMaxAge(maxAge); // 만료 시간 설정
        response.addCookie(cookie);
    }

    /**
     * 요청 및 응답에서 특정 이름의 쿠키를 삭제합니다.
     *
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     * @param name     쿠키 이름
     */
    public static void deleteCookie(HttpServletRequest request, HttpServletResponse response, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    cookie.setValue("");
                    cookie.setPath("/");
                    cookie.setMaxAge(0); // 만료 시간 0으로 설정 (삭제)
                    response.addCookie(cookie);
                }
            }
        }
    }

    /**
     * 객체를 직렬화하여 Base64 형식의 문자열로 변환합니다.
     *
     * @param object 직렬화할 객체
     * @return 직렬화된 문자열
     */
    public static String serialize(Object object) {
        return Base64.getUrlEncoder()
                .encodeToString(SerializationUtils.serialize(object));
    }

    /**
     * 쿠키에서 값을 가져와 역직렬화합니다.
     *
     * @param cookie 역직렬화할 쿠키
     * @param cls    대상 클래스 타입
     * @param <T>    대상 타입
     * @return 역직렬화된 객체
     */
    public static <T> T deserialize(Cookie cookie, Class<T> cls) {
        return cls.cast(SerializationUtils.deserialize(
                Base64.getUrlDecoder().decode(cookie.getValue())));
    }
}
