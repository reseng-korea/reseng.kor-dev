package com.resengkor.management.domain.user.api;


import com.resengkor.management.domain.user.application.UserServiceImpl;
import com.resengkor.management.domain.user.dto.ChangeRoleRequest;
import com.resengkor.management.domain.user.dto.UserDTO;
import com.resengkor.management.domain.user.dto.UserRegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserServiceImpl userServiceImpl;

    // 회원가입 (일반 사용자 등록하기)
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegisterRequest userRegisterRequest) {
        userServiceImpl.registerUser(userRegisterRequest);
        return ResponseEntity.ok("일반 회원가입 성공");
    }

    //Roll 등급 바꾸기(수정하기)
    //일단 이렇게 해놓음
    //upperId의 경우 jwt에서 가져오면 된다.
    @PutMapping("/{upperId}/{lowerId}")
    public ResponseEntity<UserDTO> changeUserRole(
            @PathVariable Long upperId,
            @PathVariable Long lowerId,
            @RequestBody ChangeRoleRequest changeRoleRequest
    ) {
        // 서비스 로직 호출하여 역할 변경
        UserDTO updatedUser = userServiceImpl.changeUserRole(upperId, lowerId, changeRoleRequest.getNewRole());

        // 변경된 사용자 정보 반환
        return ResponseEntity.ok(updatedUser);
    }

    //조회하기(region&role)

    //삭제하기

}
