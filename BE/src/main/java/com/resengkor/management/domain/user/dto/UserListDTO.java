package com.resengkor.management.domain.user.dto;

import com.querydsl.core.annotations.QueryProjection;
import com.resengkor.management.domain.user.entity.Region;
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
    private String phoneNumber;

    private String companyPhoneNumber;
    private String faxNumber;
    private String streetAddress;
    private String detailAddress;
    private String city; // String으로 변경
    private String district; // String으로 변경

    // 관리 여부 (부모-자식 관계)
    private boolean managementStatus;

//    @Builder
//    @QueryProjection
//    public UserListDTO(User user) {
//        this.userId = user.getId();
//        this.companyName = user.getCompanyName();
//        this.email = user.getEmail();
//        this.role = user.getRole();
//        this.status = user.isStatus();
//        this.createdAt = user.getCreatedAt();
//        this.phoneNumber = user.getPhoneNumber();
//
//        this.companyPhoneNumber = user.getUserProfile().getCompanyPhoneNumber();
//        this.faxNumber = user.getUserProfile().getFaxNumber();
//        this.streetAddress = user.getUserProfile().getStreetAddress();
//        this.detailAddress = user.getUserProfile().getDetailAddress();
//
//        // Region 객체의 regionName만 가져옴
//        this.city = user.getUserProfile().getCity() != null ? user.getUserProfile().getCity().getRegionName() : null;
//        this.district = user.getUserProfile().getDistrict() != null ? user.getUserProfile().getDistrict().getRegionName() : null;
//
//        this.managementStatus = false;
//    }

    @Builder
    @QueryProjection
    public UserListDTO(Long userId, String companyName, String email, Role role, boolean status,
                       LocalDateTime createdAt, String phoneNumber, String companyPhoneNumber,
                       String faxNumber, String streetAddress, String detailAddress,
                       String city, String district, boolean managementStatus) {
        this.userId = userId;
        this.companyName = companyName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
        this.phoneNumber = phoneNumber;
        this.companyPhoneNumber = companyPhoneNumber;
        this.faxNumber = faxNumber;
        this.streetAddress = streetAddress;
        this.detailAddress = detailAddress;
        this.city = city;
        this.district = district;
        this.managementStatus = managementStatus;
    }

    // 정적 팩토리 메서드
    public static UserListDTO fromUser(User user, boolean managementStatus) {
        return UserListDTO.builder()
                .userId(user.getId())
                .companyName(user.getCompanyName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.isStatus())
                .createdAt(user.getCreatedAt())
                .phoneNumber(user.getPhoneNumber())
                .companyPhoneNumber(user.getUserProfile().getCompanyPhoneNumber())
                .faxNumber(user.getUserProfile().getFaxNumber())
                .streetAddress(user.getUserProfile().getStreetAddress())
                .detailAddress(user.getUserProfile().getDetailAddress())
                .city(user.getUserProfile().getCity() != null ? user.getUserProfile().getCity().getRegionName() : null)
                .district(user.getUserProfile().getDistrict() != null ? user.getUserProfile().getDistrict().getRegionName() : null)
                .managementStatus(managementStatus)
                .build();
    }
}
