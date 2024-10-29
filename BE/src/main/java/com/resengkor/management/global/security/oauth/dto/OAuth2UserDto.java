package com.resengkor.management.global.security.oauth.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class OAuth2UserDto {
    private String socialProvider;
    private String socialId;
    private String name;//대표 이름
    private String email;
    private String role;
    private Long userId;

    @Builder
    public OAuth2UserDto(String socialProvider, String socialId, String name, String email, String role, Long userId) {
        this.socialProvider = socialProvider;
        this.socialId = socialId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.userId = userId;
    }
}