package com.resengkor.management.domain.user.dto;

import com.querydsl.core.annotations.QueryProjection;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserListDTO {

    private Long userId;
    private String companyName;
    private String email;
    private Role role;
    private boolean status;
    private LocalDateTime createdAt;

    @Builder
    @QueryProjection
    public UserListDTO(User user) {
        this.userId = user.getId();
        this.companyName = user.getCompanyName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.status = user.isStatus();
        this.createdAt = user.getCreatedAt();
    }
}
