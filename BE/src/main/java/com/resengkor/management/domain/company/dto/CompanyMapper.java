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

        return CompanyDTO.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .role(company.getRole().toString())
                .companyPhoneNumber(company.getCompanyPhoneNumber())
                .streetAddress(company.getStreetAddress())
                .detailAddress(company.getDetailAddress())
                .city(company.getCity())
                .district(company.getDistrict())
                .latitude(company.getLatitude())
                .longitude(company.getLongitude())
                .build();
    }
}
