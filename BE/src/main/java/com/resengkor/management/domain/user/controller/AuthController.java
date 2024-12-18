package com.resengkor.management.domain.user.controller;

import com.resengkor.management.domain.user.dto.*;
import com.resengkor.management.domain.user.dto.request.*;
import com.resengkor.management.domain.user.dto.response.FindEmailResponse;
import com.resengkor.management.domain.user.service.UserService;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
//일반 회원가입
public class AuthController {
    private final UserService userService;

    // 회원가입 (일반 사용자 등록하기)
    @PostMapping("/register")
    public DataResponse<UserDTO> registerUser(@Valid @RequestBody UserRegisterRequest userRegisterRequest, BindingResult bindingResult) {
        log.info("회원가입 요청이 들어옴: {}", userRegisterRequest);
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = userService.validateHandling(bindingResult);
            log.info("바인딩 에러");
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }
        log.info("회원가입 서비스로 넘어감");

        return userService.registerUser(userRegisterRequest);
    }

    //아이디 찾기
    @PostMapping("/find-email")
    public DataResponse<FindEmailResponse> findEmail(@Valid @RequestBody FindEmailRequest findEmailRequest, BindingResult bindingResult) {
        log.info("이메일 찾기 요청이 들어옴: {}", findEmailRequest);

        // 바인딩 에러가 있는지 확인
        if (bindingResult.hasErrors()) {
            Map<String, String> validatorResult = userService.validateHandling(bindingResult);
            log.warn("바인딩 에러 발생: {}", validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        // 이메일 찾기 서비스 호출
        return userService.findEmail(findEmailRequest);
    }

    //비밀번호 찾기(이메일, 핸드폰 번호로)
    @PostMapping("/find-password")
    public DataResponse<String> findPassword(@Valid @RequestBody FindPasswordRequest findPasswordRequest, BindingResult bindingResult) {
        log.info("비밀번호 찾기 요청이 들어옴: {}", findPasswordRequest);

        // 바인딩 에러가 있는지 확인
        if (bindingResult.hasErrors()) {
            Map<String, String> validatorResult = userService.validateHandling(bindingResult);
            log.warn("바인딩 에러 발생: {}", validatorResult);
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        // 이메일 찾기 서비스 호출
        return userService.findPassword(findPasswordRequest);
    }

    //이메일 중복 확인하기
    @GetMapping("/check-email")
    public DataResponse<String> emailDupCheck(@RequestParam(value = "email") String email) {
        log.info("이메일 중복 확인하기: {}", email);
        return userService.emailDupCheck(email);
    }


}
