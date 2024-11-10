package com.resengkor.management.global.security.oauth.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class OAuth2UserDto {
    private String socialProvider;
    private String socialId;
    private String representativeName;//대표 이름
    private String email;
    private String role;
    private Long userId;
    private boolean status;
    private String phoneNumber;

    @Builder
    public OAuth2UserDto(String socialProvider, String socialId, String representativeName, String email, String role, Long userId, boolean status,String phoneNumber) {
        this.socialProvider = socialProvider;
        this.socialId = socialId;
        this.representativeName = representativeName;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.status = status;
        this.phoneNumber = phoneNumber;
    }
}