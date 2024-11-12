package com.resengkor.management.domain.company.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDTO {
    private Long id;
    private String companyName;
    private String role;
    private String companyPhoneNumber;
    private String streetAddress;
    private String detailAddress;
    private String city;
    private String district;
    private Double latitude;
    private Double longitude;
}
