package com.resengkor.management.global.security.jwt.controller;

import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.security.jwt.service.ReissueService;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * refresh 토큰으로 재발급 요청 처리
 * refresh rotate 적용
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@Slf4j
public class ReissueController {
    private final ReissueService reissueService;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/reissue")
    public CommonResponse reissue(HttpServletRequest request, HttpServletResponse response) {
        log.info("----Controller Start: refresh 재발급 요청-----");
        return reissueService.reissue(request, response);
    }

    /**
     * ✅ 회원 정보 조회 API (POST 요청으로 변경)
     */
    @PostMapping("/user-info")
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        log.info("----Controller Start: 회원 정보 조회 요청-----");

        // 🔹 1. Authorization 헤더에서 토큰 가져오기
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new CustomException(ExceptionStatus.TOKEN_NOT_FOUND_IN_HEADER);
        }

        String accessToken = authorizationHeader.substring(7);
        String email = jwtUtil.getEmail(accessToken);

        if (email == null) {
            throw new CustomException(ExceptionStatus.TOKEN_PARSE_ERROR);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "name", user.getName(),
                "loginType", user.getLoginType(),
                "status", user.isStatus()
        ));
    }
}
