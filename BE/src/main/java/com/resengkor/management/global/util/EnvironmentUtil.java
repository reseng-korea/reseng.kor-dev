package com.resengkor.management.global.util;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class EnvironmentUtil {

    /**
     * 로컬 환경인지 배포 환경인지를 구분합니다.
     * @param request HttpServletRequest
     * @return 로컬 환경이면 true, 아니면 false
     */
    public static boolean isLocalEnvironment(HttpServletRequest request) {
        String serverName = request.getServerName();  // 서버 이름 (localhost 또는 127.0.0.1)
        String scheme = request.getScheme();  // 프로토콜 (http 또는 https)
        String serverPort = String.valueOf(request.getServerPort());  // 서버 포트
        String requestURI = request.getRequestURI();  // 요청 URI
        String remoteAddr = request.getRemoteAddr();  // 클라이언트 IP
        String remoteHost = request.getRemoteHost();  // 클라이언트 호스트 이름
        String forwardedFor = request.getHeader("X-Forwarded-For");  // 프록시에서 전달한 클라이언트 IP
        String userAgent = request.getHeader("User-Agent");  // User-Agent (브라우저 정보)
        String acceptLanguage = request.getHeader("Accept-Language");  // Accept-Language 헤더
        String referer = request.getHeader("Referer");  // Referer 헤더
        String authorization = request.getHeader("Authorization");  // Authorization 헤더 (인증 정보)

        log.info("서버 이름 : {}", serverName);
        log.info("프로토콜 : {}", scheme);
        log.info("서버 포트 : {}", serverPort);
        log.info("요청 URI : {}", requestURI);
        log.info("클라이언트 IP : {}", remoteAddr);
        log.info("클라이언트 호스트 : {}", remoteHost);
        log.info("X-Forwarded-For : {}", forwardedFor);
        log.info("User-Agent : {}", userAgent);
        log.info("Accept-Language : {}", acceptLanguage);
        log.info("Referer : {}", referer);
        log.info("Authorization : {}", authorization);

        // 로컬 환경: localhost 또는 127.0.0.1이 도메인 이름으로 사용되고, http 프로토콜을 사용
        boolean isLocal = ("localhost".equals(serverName) || "127.0.0.1".equals(serverName)) && "http".equals(scheme);

        log.info("로컬 환경 여부 : {}", isLocal);
        return isLocal;
    }
}