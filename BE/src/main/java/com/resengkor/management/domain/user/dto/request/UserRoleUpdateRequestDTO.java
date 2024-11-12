package com.resengkor.management.domain.user.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.resengkor.management.domain.user.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserRoleUpdateRequestDTO {

    private Long targetUserId;

    private Role targetRole;

    @Builder
    public UserRoleUpdateRequestDTO(Long targetUserId, Role targetRole) {
        this.targetUserId = targetUserId;
        this.targetRole = targetRole;
    }
}
