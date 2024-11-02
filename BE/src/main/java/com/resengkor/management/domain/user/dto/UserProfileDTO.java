package com.resengkor.management.domain.user.dto;

import com.resengkor.management.domain.user.entity.Region;
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
    private String address;
    private Double latitude;
    private Double longitude;
    private Region city;
    private Region district;

    @Builder
    public UserProfileDTO(Long id,String address, Double latitude, Double longitude, Region city, Region district) {
        this.id = id;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
        this.district = district;
    }
}
