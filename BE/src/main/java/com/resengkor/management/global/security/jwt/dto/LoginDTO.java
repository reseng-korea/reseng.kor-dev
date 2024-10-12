package com.resengkor.management.global.security.jwt.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class LoginDTO {
    private String email;
    private String password;

    @Builder
    public LoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
