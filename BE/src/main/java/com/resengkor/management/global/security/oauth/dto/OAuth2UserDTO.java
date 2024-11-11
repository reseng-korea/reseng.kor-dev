package com.resengkor.management.global.security.oauth.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2UserDTO {
    private Long userId;
    private String socialProvider;
    private String socialProviderId;
    private String representativeName;//대표 이름
    private String email;
    private String role;
    private boolean status;
    private String phoneNumber;
}