package com.resengkor.management.global.security.jwt.controller;

import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.jwt.service.ReissueService;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import java.util.Map;
import java.util.HashMap;

/**
 * refresh 토큰으로 재발급 요청 처리
 * refresh rotate 적용
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Slf4j
public class ReissueController {
    private final UserRepository userRepository;
    private final ReissueService reissueService;
    private final JWTUtil jwtUtil;

    /**
     * AccessToken을 쿠키에서 확인하여 로그인 상태를 반환하는 API
     */
    @GetMapping("/check-auth")
    public ResponseEntity<Boolean> checkAuth(HttpServletRequest request) {
        log.info("----Controller Start: 인증 상태 확인 요청-----");

        // 1. 쿠키에서 accessToken 찾기
        String accessToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }

        // 2. accessToken이 없는 경우 (로그아웃 상태)
        if (accessToken == null) {
            log.info("check-auth: AccessToken 쿠키 없음 (로그아웃 상태)");
            return ResponseEntity.ok(false);
        }

        // 3. accessToken 유효성 검사
        try {
            jwtUtil.isExpired(accessToken); // 만료 여부 확인
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            log.info("check-auth: AccessToken 만료 또는 오류 발생 - {}", e.getMessage());
            return ResponseEntity.ok(false);
        }
    }

@GetMapping("/user-info")
public ResponseEntity<CommonResponse> getUserInfo(HttpServletRequest request) {
    log.info("----Controller Start: 로그인된 사용자 정보 요청-----");

    // 1. 쿠키에서 accessToken 찾기
    String accessToken = null;
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        for (Cookie cookie : cookies) {
            if ("accessToken".equals(cookie.getName())) {
                accessToken = cookie.getValue();
                break;
            }
        }
    }

    // 2. accessToken이 없으면 예외 발생
    if (accessToken == null) {
        throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_COOKIE);
    }

    // 3. accessToken 유효성 검사
    if (jwtUtil.isExpired(accessToken)) {
        throw new CustomException(ExceptionStatus.ACCESS_TOKEN_EXPIRED);
    }

    // 4. accessToken에서 사용자 정보 추출
    String email = jwtUtil.getEmail(accessToken);
    Long userId = jwtUtil.getUserId(accessToken);
    String role = jwtUtil.getRole(accessToken);
    String loginType = jwtUtil.getLoginType(accessToken);

    // 5. 유저 정보 조회
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

    // 6. 응답 데이터 구성
    Map<String, Object> userInfo = new HashMap<>();
    userInfo.put("userId", userId);
    userInfo.put("role", role);
    userInfo.put("loginType", loginType);
    userInfo.put("name", user.getRepresentativeName());

    return ResponseEntity.ok().body(
        Map.of(
            "code", ResponseStatus.RESPONSE_SUCCESS.getCode(),
            "message", ResponseStatus.RESPONSE_SUCCESS.getMessage(),
            "data", userInfo
        )
    );
    
}


    @PostMapping("/reissue")
    public CommonResponse reissue(HttpServletRequest request, HttpServletResponse response) {
        log.info("----Controller Start: refresh 재발급 요청-----");
        return reissueService.reissue(request, response);
    }
}
