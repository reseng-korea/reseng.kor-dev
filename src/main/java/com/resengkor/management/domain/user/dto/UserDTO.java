package com.resengkor.management.domain.user.dto;


import com.resengkor.management.domain.user.entity.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String email;
    private String companyName;
    private String phoneNumber;
    private Role role;
    private LocalDateTime createdAt;
    private UserProfileDTO userProfile;

    @Builder
    public UserDTO(Long id, String email, String companyName, String phoneNumber, Role role, LocalDateTime createdAt, UserProfileDTO userProfile) {
        this.id = id;
        this.email = email;
        this.companyName = companyName;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.createdAt = createdAt;
        this.userProfile = userProfile;
    }
}
