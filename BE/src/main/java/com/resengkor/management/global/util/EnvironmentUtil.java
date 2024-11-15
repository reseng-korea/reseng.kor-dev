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
        log.info("서버 이름 : {}, 프로토콜: {}", serverName, scheme);

        // 로컬 환경: localhost 또는 127.0.0.1이 도메인 이름으로 사용되고, http 프로토콜을 사용
        return ("localhost".equals(serverName) || "127.0.0.1".equals(serverName)) && "http".equals(scheme);
    }
}