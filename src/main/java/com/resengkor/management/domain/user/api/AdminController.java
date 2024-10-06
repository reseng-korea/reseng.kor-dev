package com.resengkor.management.domain.user.api;

import com.resengkor.management.domain.user.application.AdminServiceImpl;
import com.resengkor.management.domain.user.dto.ChangeRoleRequest;
import com.resengkor.management.domain.user.dto.UserDTO;
import com.resengkor.management.domain.user.dto.UserRegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {
    private final AdminServiceImpl adminServiceImpl;


    // 1. 회원가입 (등록하기)
    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody UserRegisterRequest userRegisterRequest) {
        // 회원가입 처리 로직 호출
        adminServiceImpl.registerUser(userRegisterRequest);

        return ResponseEntity.ok("관리자 회원가입 성공");
    }


    // 롤(Role) 등급 변경하기 (PUT 방식)
    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDTO> changeUserRole(
            @PathVariable Long userId,
            @RequestBody ChangeRoleRequest changeRoleRequest
    ) {
        // 현재 사용자는 관리자라고 가정 (따로 인증이 있으면 인증된 관리자 정보 가져오기)
        Long adminId = getAdminId(); // 예시로 관리자 ID를 가져오는 메서드
        // 사용자 롤 변경 처리
        UserDTO updatedUser = adminServiceImpl.changeUserRole(adminId, userId, changeRoleRequest.getNewRole());
        return ResponseEntity.ok().body(updatedUser);
    }

    // 관리자 ID 가져오기 (예시, 인증 로직 추가 필요)
    private Long getAdminId() {
        return 1L; // 관리자의 ID를 리턴 (임의로 1로 지정)
    }

    //조회하기(region&role)

    //삭제하기(탈퇴하기랑 비슷)



}