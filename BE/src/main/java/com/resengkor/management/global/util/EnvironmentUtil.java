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
        // 기본 서버 및 요청 정보 가져오기
        String serverName = request.getServerName();  // 서버 이름 (localhost 또는 127.0.0.1)
        String scheme = request.getScheme();  // 프로토콜 (http 또는 https)
        String serverPort = String.valueOf(request.getServerPort());  // 서버 포트
        String requestURI = request.getRequestURI();  // 요청 URI
        String remoteAddr = request.getRemoteAddr();  // 클라이언트 IP
        String remoteHost = request.getRemoteHost();  // 클라이언트 호스트 이름
        String pathInfo = request.getPathInfo();  // 경로 정보 (디렉토리 정보)
        String queryString = request.getQueryString();  // 쿼리 스트링
        String referer = request.getHeader("Referer");  // Referer 헤더
        String userAgent = request.getHeader("User-Agent");  // User-Agent 헤더 (브라우저 정보)
        String acceptLanguage = request.getHeader("Accept-Language");  // Accept-Language 헤더
        String authorization = request.getHeader("Authorization");  // Authorization 헤더 (인증 정보)

        // X-Forwarded-For 헤더 (프록시 서버가 있을 경우 클라이언트 IP 추적)
        String xForwardedFor = request.getHeader("X-Forwarded-For");

        // 로그로 출력
        log.info("서버 이름 : {}", serverName);
        log.info("프로토콜 : {}", scheme);
        log.info("서버 포트 : {}", serverPort);
        log.info("요청 URI : {}", requestURI);
        log.info("클라이언트 IP : {}", remoteAddr);
        log.info("클라이언트 호스트 : {}", remoteHost);
        log.info("경로 정보 : {}", pathInfo);
        log.info("쿼리 스트링 : {}", queryString);
        log.info("Referer : {}", referer);
        log.info("User-Agent : {}", userAgent);
        log.info("Accept-Language : {}", acceptLanguage);
        log.info("Authorization : {}", authorization);
        log.info("X-Forwarded-For : {}", xForwardedFor);

        // 로컬 환경을 구분할 때 Referer 헤더를 활용하여 외부 도메인 여부를 판단
        boolean isLocal = ("localhost".equals(serverName) || "127.0.0.1".equals(serverName)) && "http".equals(scheme);

        // Referer가 외부 도메인을 포함하는지 확인
        if (referer != null && referer.contains("reseng.co.kr")) {
            isLocal = false;  // 외부 도메인에서 들어온 경우 로컬 환경이 아님
            log.info("도메인으로 들어온 요청입니다. isLocal = {}", isLocal);
        }

        log.info("로컬 환경 여부 : {}", isLocal);
        return isLocal;
    }
}