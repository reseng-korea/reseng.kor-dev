package com.resengkor.management.domain.user.dto;

import com.resengkor.management.domain.user.entity.Region;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {

    private Long id;
    private String companyPhoneNumber;
    private String faxNumber;
    private String streetAddress;
    private String detailAddress;
    private Double latitude;
    private Double longitude;
    private Region city;
    private Region district;
}
