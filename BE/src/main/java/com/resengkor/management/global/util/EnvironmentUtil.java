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
        String forwardedHost = request.getHeader("X-Forwarded-Host");  // 프록시에서 전달한 원본 호스트
        String forwardedFor = request.getHeader("X-Forwarded-For");  // 프록시에서 전달한 클라이언트 IP

        log.info("서버 이름 : {}", serverName);
        log.info("프로토콜 : {}", scheme);
        log.info("X-Forwarded-Host : {}", forwardedHost);
        log.info("X-Forwarded-For : {}", forwardedFor);

        // 로컬 환경을 구분할 때, X-Forwarded-Host를 활용하여 외부 도메인 여부를 판단
        boolean isLocal = ("localhost".equals(serverName) || "127.0.0.1".equals(serverName)) && "http".equals(scheme);

        // 만약 X-Forwarded-Host 헤더가 있다면, 외부 도메인에서 들어온 것이라면 로컬 환경이 아님
        if (forwardedHost != null && forwardedHost.contains("reseng.co.kr")) {
            isLocal = false;
        }

        log.info("로컬 환경 여부 : {}", isLocal);
        return isLocal;
    }
}