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
        String referer = request.getHeader("Referer");  // Referer 헤더 (도메인 정보)

        log.info("서버 이름 : {}", serverName);
        log.info("프로토콜 : {}", scheme);
        log.info("Referer : {}", referer);

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