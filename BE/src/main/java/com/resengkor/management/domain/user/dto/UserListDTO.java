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

    @Builder
    @QueryProjection
    public UserListDTO(User user) {
        this.userId = user.getId();
        this.companyName = user.getCompanyName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.status = user.isStatus();
        this.createdAt = user.getCreatedAt();
        this.phoneNumber = user.getPhoneNumber();

        this.companyPhoneNumber = user.getUserProfile().getCompanyPhoneNumber();
        this.faxNumber = user.getUserProfile().getFaxNumber();
        this.streetAddress = user.getUserProfile().getStreetAddress();
        this.detailAddress = user.getUserProfile().getDetailAddress();

        // Region 객체의 regionName만 가져옴
        this.city = user.getUserProfile().getCity() != null ? user.getUserProfile().getCity().getRegionName() : null;
        this.district = user.getUserProfile().getDistrict() != null ? user.getUserProfile().getDistrict().getRegionName() : null;
    }
}
