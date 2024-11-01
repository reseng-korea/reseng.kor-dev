package com.resengkor.management.domain.user.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserListPaginationDTO {

    private int totalCount;
    private List<UserListDTO> userList;

    @Builder
    public UserListPaginationDTO(int totalCount, List<UserListDTO> userList) {
        this.totalCount = totalCount;
        this.userList = userList;
    }
}
