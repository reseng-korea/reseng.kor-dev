package com.resengkor.management.global.security.jwt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    private boolean isAuto;

    @Builder
    public LoginDTO(String email, String password,boolean isAuto) {
        this.email = email;
        this.password = password;
        this.isAuto = isAuto;
    }
}
