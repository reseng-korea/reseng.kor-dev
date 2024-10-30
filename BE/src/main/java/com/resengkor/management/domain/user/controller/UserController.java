package com.resengkor.management.domain.user.controller;


import com.resengkor.management.domain.user.dto.OauthUserUpdateRequest;
import com.resengkor.management.domain.user.dto.UserDTO;
import com.resengkor.management.domain.user.dto.UserUpdateRequest;
import com.resengkor.management.domain.user.service.UserService;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.DataResponse;
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


    @GetMapping("/test-login-id")
    public DataResponse<Long> tmp(){
        log.info("enter test-login-id controller");
        return userServiceImpl.tmp();
    }


}
