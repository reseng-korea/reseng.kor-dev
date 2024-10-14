package com.resengkor.management.domain.user.controller;

import com.resengkor.management.domain.user.service.UserServiceImpl;
import com.resengkor.management.domain.user.dto.UserRegisterRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
//일반 회원가입
public class RegisterController {
    private final UserServiceImpl userServiceImpl;

    // 회원가입 (일반 사용자 등록하기)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterRequest userRegisterRequest, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            Map<String, String> validatorResult = userServiceImpl.validateHandling(bindingResult);

            return ResponseEntity.badRequest().body(validatorResult);
        }

        userServiceImpl.registerUser(userRegisterRequest);
        return ResponseEntity.ok("일반 회원가입 성공");
    }
}
