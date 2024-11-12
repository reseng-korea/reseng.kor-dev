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

    // 필요한 정보만 담은 CompanyInfoDTO 변환 메서드
    public CompanyInfoDTO toCompanyInfoDTO(User user) {
        if (user == null) {
            return null;
        }

        UserProfile userProfile = user.getUserProfile();

        return CompanyInfoDTO.builder()
                .userId(user.getId())
                .role(user.getRole() != null ? user.getRole().getRole() : null)
                .companyName(user.getCompanyName())
                .userProfileId(userProfile != null ? userProfile.getId() : null)
                .companyPhoneNumber(userProfile != null ? userProfile.getCompanyPhoneNumber() : null)
                .streetAddress(userProfile != null ? userProfile.getStreetAddress() : null)
                .detailAddress(userProfile != null ? userProfile.getDetailAddress() : null)
                .city(userProfile != null ? userProfile.getCity() : null)
                .district(userProfile != null ? userProfile.getDistrict() : null)
                .latitude(userProfile != null ? userProfile.getLatitude() : null)
                .longitude(userProfile != null ? userProfile.getLongitude() : null)
                .build();
    }
}