package com.resengkor.management.global.security.jwt.dto;

import com.resengkor.management.domain.user.dto.UserProfileDTO;
import com.resengkor.management.domain.user.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String email;
    private boolean emailStatus;
    private boolean temporaryPasswordStatus;
    private String companyName;
    private String representativeName;
    private String phoneNumber;
    private boolean phoneNumberStatus;
    private String role;
    private String loginType;
    private boolean status;
}
