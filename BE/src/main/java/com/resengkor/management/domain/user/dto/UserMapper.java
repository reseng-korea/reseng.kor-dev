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
                .emailStatus(user.isEmailStatus())
                .temporaryPasswordStatus(user.isTemporaryPasswordStatus())
                .companyName(user.getCompanyName())
                .representativeName(user.getRepresentativeName())
                .phoneNumber(user.getPhoneNumber())
                .phoneNumberStatus(user.isPhoneNumberStatus())
                .role(user.getRole())
                .loginType(user.getLoginType().toString())
                .status(user.isStatus())
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
                .companyPhoneNumber(userProfile.getCompanyPhoneNumber())
                .faxNumber(userProfile.getFaxNumber())
                .streetAddress(userProfile.getStreetAddress())
                .detailAddress(userProfile.getDetailAddress())
                .city(userProfile.getCity())
                .district(userProfile.getDistrict())
                .latitude(userProfile.getLatitude())
                .longitude(userProfile.getLongitude())
                .build();
    }
}