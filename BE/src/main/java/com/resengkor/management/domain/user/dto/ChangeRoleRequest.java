package com.resengkor.management.domain.user.dto;


import com.resengkor.management.domain.user.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeRoleRequest {
    private Role newRole; //변경할 새로운 롤 (ENUM)타입
}
