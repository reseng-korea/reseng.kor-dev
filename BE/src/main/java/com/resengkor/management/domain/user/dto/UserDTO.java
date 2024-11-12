package com.resengkor.management.domain.user.dto;


import com.resengkor.management.domain.user.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private boolean emailStatus;
    private boolean temporaryPasswordStatus;
    private String companyName;
    private String representativeName;
    private String phoneNumber;
    private boolean phoneNumberStatus;
    private Role role;
    private String loginType;
    private boolean status;
    private LocalDateTime createdAt;
    private UserProfileDTO userProfile;
}
