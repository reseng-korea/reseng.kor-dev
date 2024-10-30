package com.resengkor.management.domain.user.controller;

import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.service.AdminServiceImpl;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminServiceImpl adminServiceImpl;

    // 관리자 ID 가져오기 (예시, 인증 로직 추가 필요)
    private Long getAdminId() {
        return 1L; // 관리자의 ID를 리턴 (임의로 1로 지정)
    }

    //조회하기(region&role)

    //삭제하기(탈퇴하기랑 비슷)

    @Operation(description = "MANAGER가 하위 모든 사용자 목록 조회")
    @GetMapping("/users")
    public DataResponse<?> getAllUserByManager() {

        return adminServiceImpl.getAllUserByManager();
    }
}