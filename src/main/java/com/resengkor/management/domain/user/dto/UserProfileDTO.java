package com.resengkor.management.domain.user.dto;

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

    @Builder
    public UserProfileDTO(Long id,String address, Double latitude, Double longitude) {
        this.id = id;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
