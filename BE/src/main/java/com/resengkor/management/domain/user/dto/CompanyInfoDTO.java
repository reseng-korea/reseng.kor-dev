package com.resengkor.management.domain.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyInfoDTO {
    private Long userId;
    private String companyName;
    private String phoneNumber;
    private Long userProfileId;
    private String address;
    private Double latitude;
    private Double longitude;
}
