package com.resengkor.management.global.security.jwt.controller;

import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.security.jwt.service.ReissueService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @PostMapping("/reissue")
    public CommonResponse reissue(HttpServletRequest request, HttpServletResponse response) {
        log.info("------------------------------------------------");
        log.info("enter reissue controller");
        log.info("------------------------------------------------");
        return reissueService.reissue(request, response);
    }
}
