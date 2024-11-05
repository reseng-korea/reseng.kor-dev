package com.resengkor.management.domain.user.controller;


import com.resengkor.management.domain.user.dto.request.OauthUserUpdateRequest;
import com.resengkor.management.domain.user.dto.UserDTO;
import com.resengkor.management.domain.user.dto.request.ResetPasswordRequest;
import com.resengkor.management.domain.user.dto.request.UserUpdateRequest;
import com.resengkor.management.domain.user.dto.request.VerifyPasswordRequest;
import com.resengkor.management.domain.user.service.UserService;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userServiceImpl;

    //회원정보 추가하기(oauth용)
    @PutMapping("/oauth/{userId}")
    public DataResponse<UserDTO> oauthUpdateUser(@PathVariable Long userId, @Valid @RequestBody OauthUserUpdateRequest request, BindingResult bindingResult){
        log.info("oauth 회원 정보 추가 요청이 들어옴: {}", request);
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = userServiceImpl.validateHandling(bindingResult);
            log.info("바인딩 에러");
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }
        log.info("oauth 회원 정보 추가 서비스로 넘어감");
        return userServiceImpl.oauthUpdateUser(userId, request);
    }

    //회원정보 수정하기
    @PutMapping("/{userId}")
    public DataResponse<UserDTO> updateUser(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequest request, BindingResult bindingResult){
        log.info("회원 정보 수정 요청이 들어옴: {}", request);
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = userServiceImpl.validateHandling(bindingResult);
            log.info("바인딩 에러");
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }
        log.info("회원 정보 수정 서비스로 넘어감");
        return userServiceImpl.updateUser(userId, request);
    }

    //회원정보 요청
    @GetMapping("/{userId}")
    public DataResponse<UserDTO> getUserInfo(@PathVariable Long userId){
        log.info("회원 정보 요청 들어옴");
        return userServiceImpl.getUserInfo(userId);
    }

    //일반 회원탈퇴
    @PutMapping("/withdrawal")
    public CommonResponse withdrawUser(@RequestHeader("Authorization") String token) {
        return userServiceImpl.withdrawUser(token);
    }

    //비밀번호 확인(정보 확인용)
    @PostMapping("/{userId}/password/verify")
    public DataResponse<String> verifyPassword(@RequestBody VerifyPasswordRequest verifyPasswordRequest) {
        return userServiceImpl.verifyPassword(verifyPasswordRequest);
    }

    //임시번호 발급받아서 비밀번호 변경하기 & 새 비밀번호로 변경하기
    @PutMapping("/{userId}/password")
    public DataResponse<String> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest, BindingResult bindingResult) {
        log.info("새 비밀번호로 변경하기 : {}", resetPasswordRequest);
        // 바인딩 에러가 있는지 확인
        if (bindingResult.hasErrors()) {
            Map<String, String> validatorResult = userServiceImpl.validateHandling(bindingResult);
            log.warn("바인딩 에러 발생: {}", validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }
        return userServiceImpl.resetPassword(resetPasswordRequest);
    }


    @GetMapping("/test-login-id")
    public DataResponse<Long> tmp(){
        log.info("enter test-login-id controller");
        return userServiceImpl.tmp();
    }


    @Operation(description = "로그인 유저의 하위 사용자 목록 조건부 조회 (Pagination)")
    @GetMapping("/pagination")
    public DataResponse<?> getAllUserByManager(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "createdDate", required = false) String createdDate) {

        return userServiceImpl.getAllUserByManager(page, role, status, createdDate);
    }
}
