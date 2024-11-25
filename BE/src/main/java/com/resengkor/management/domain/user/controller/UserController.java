package com.resengkor.management.domain.user.controller;


import com.resengkor.management.domain.user.dto.request.*;
import com.resengkor.management.domain.user.dto.UserDTO;
import com.resengkor.management.domain.user.service.UserService;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.util.ValidatorUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    //테스트용
    @GetMapping("/test-login-id")
    public DataResponse<Long> tmp(){
        log.info("enter test-login-id controller");
        return userServiceImpl.tmp();
    }

    //회원정보 추가하기(oauth용)
    @PutMapping("/oauth/{userId}")
    public DataResponse<UserDTO> oauthUpdateUser(@PathVariable("userId") Long userId, @Valid @RequestBody OauthUserUpdateRequest request, BindingResult bindingResult){
        log.info("----Controller Start: OAuth 회원 정보 추가하기-----");

        // 바인딩 에러가 있는지 확인
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = ValidatorUtil.validateHandling(bindingResult);
            log.warn("바인딩 에러 발생: {}", validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        return userServiceImpl.oauthUpdateUser(userId, request);
    }

    //회원정보 수정하기
    @PutMapping("/{userId}")
    public DataResponse<UserDTO> updateUser(@PathVariable("userId") Long userId, @Valid @RequestBody UserUpdateRequest request, BindingResult bindingResult){
        log.info("----Controller Start: 회원 정보(일반,소셜) 수정하기-----");

        // 바인딩 에러가 있는지 확인
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = ValidatorUtil.validateHandling(bindingResult);
            log.warn("바인딩 에러 발생: {}", validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        return userServiceImpl.updateUser(userId, request);
    }

    //회원정보 요청
    @GetMapping("/{userId}")
    public DataResponse<UserDTO> getUserInfo(@PathVariable("userId") Long userId){
        log.info("----Controller Start: 개인 회원정보 요청-----");

        return userServiceImpl.getUserInfo(userId);
    }

    //회원탈퇴
    @PutMapping("/withdrawal")
    public CommonResponse withdrawUser(HttpServletRequest request, HttpServletResponse response) {
        log.info("----Controller Start: 회원탈퇴 요청-----");

        return userServiceImpl.withdrawUser(request, response);
    }

    //비밀번호 확인(정보 확인용)
    @PostMapping("/{userId}/password/verify")
    public DataResponse<String> verifyPassword(@PathVariable("userId") Long userId, @Valid @RequestBody VerifyPasswordRequest request, BindingResult bindingResult) {
        log.info("----Controller Start: 비밀번호 재확인(정보 확인용)-----");

        // 바인딩 에러가 있는지 확인
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = ValidatorUtil.validateHandling(bindingResult);
            log.warn("바인딩 에러 발생: {}", validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        return userServiceImpl.verifyPassword(userId, request);
    }

    //(두 경우 모두 로그인 완료한 상태)임시번호 발급받은 상태인데, 비밀번호 변경 & 새 비밀번호로 변경하기
    @PutMapping("/{userId}/password")
    public DataResponse<String> resetPassword(@PathVariable("userId") Long userId, @Valid @RequestBody ResetPasswordRequest request, BindingResult bindingResult) {
        log.info("----Controller Start: 비밀번호 변경하기-----");

        // 바인딩 에러가 있는지 확인
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = ValidatorUtil.validateHandling(bindingResult);
            log.warn("바인딩 에러 발생: {}", validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        return userServiceImpl.resetPassword(userId, request);
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

    @Operation(description = "로그인 유저의 하위 사용자 등급 수정")
    @PatchMapping("/roles")
    public CommonResponse updateUserRole(@Valid @RequestBody UserRoleUpdateRequestDTO userRoleUpdateRequestDTO) {
        log.info(String.valueOf(userRoleUpdateRequestDTO.getTargetRole()));
        return userServiceImpl.updateUserRole(userRoleUpdateRequestDTO);
    }
}
