package com.resengkor.management.global.util;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

public class ValidatorUtil {
    public static Map<String, String> validateHandling(BindingResult bindingResult) {
        // 유효성 검사 결과를 Map으로 반환하는 메서드
        // 어떤 오류가 발생했는지 상세하게 에러를 반환함
        Map<String, String> validatorResult = new HashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            String validKeyName = String.format("valid_%s", error.getField());
            validatorResult.put(validKeyName, error.getDefaultMessage());
        }
        return validatorResult;
    }
}
