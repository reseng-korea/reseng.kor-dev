package com.resengkor.management.domain.user.dto.response;

import com.resengkor.management.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder(toBuilder = true)
public class UserResponseDto {

    private String companyName;

    private UserResponseDto(String companyName) {
        this.companyName = companyName;
    }

    public static UserResponseDto of(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseDto(user.getCompanyName());
    }
}
