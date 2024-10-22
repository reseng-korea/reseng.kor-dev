package com.resengkor.management.domain.user.dto;


import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.entity.UserProfile;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    // User 엔티티 -> UserDTO 변환 메서드
    public UserDTO toUserDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .companyName(user.getCompanyName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .userProfile(toUserProfileDTO(user.getUserProfile())) // UserProfile -> UserProfileDTO 변환
                .build();
    }

    // UserProfile 엔티티 -> UserProfileDTO 변환 메서드
    public UserProfileDTO toUserProfileDTO(UserProfile userProfile) {
        if (userProfile == null) {
            return null;
        }
        return UserProfileDTO.builder()
                .id(userProfile.getId())
                .address(userProfile.getFullAddress())
                .latitude(userProfile.getLatitude())
                .longitude(userProfile.getLongitude())
                .build();
    }
}