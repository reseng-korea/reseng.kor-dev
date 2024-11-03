package com.resengkor.management.domain.banner.service;

import com.resengkor.management.global.security.jwt.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class UserIdentificationService {

    Long getUserIdFromAuthentication(Authentication authentication) {
        // CustomUserDetails 객체에서 사용자 ID(Long)를 올바르게 가져오는 방법
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserId();
    }
}
