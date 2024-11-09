package com.resengkor.management.domain.user.dto;

import com.resengkor.management.domain.user.entity.Region;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyInfoDTO {
    private Long userId;
    private String companyName;
    private String role;
//    private String phoneNumber;
    private Long userProfileId;
    private String companyPhoneNumber;
//    private String faxNumber;
    private String streetAddress;
    private String detailAddress;
    private Region city;
    private Region district;
    private Double latitude;
    private Double longitude;
}
