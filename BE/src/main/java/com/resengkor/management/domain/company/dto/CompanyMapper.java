package com.resengkor.management.domain.company.dto;

import com.resengkor.management.domain.company.entity.Company;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.entity.UserProfile;
import org.springframework.stereotype.Component;


@Component
public class CompanyMapper {
    // 필요한 정보만 담은 CompanyInfoDTO 변환 메서드
    public CompanyDTO toCompanyDTO(Company company) {
        if (company == null) {
            return null;
        }

        UserProfile userProfile = user.getUserProfile();

        return CompanyDTO.builder()
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
