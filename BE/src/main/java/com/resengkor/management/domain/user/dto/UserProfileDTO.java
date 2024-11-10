package com.resengkor.management.domain.user.dto;

import com.resengkor.management.domain.user.entity.Region;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Builder
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


    @Builder
    public UserProfileDTO(Long id,String companyPhoneNumber, String faxNumber,
                          String streetAddress, String detailAddress, Double latitude, Double longitude, Region city, Region district) {
        this.id = id;
        this.companyPhoneNumber = companyPhoneNumber;
        this.faxNumber = faxNumber;
        this.streetAddress = streetAddress;
        this.detailAddress = detailAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
        this.district = district;
    }
}
