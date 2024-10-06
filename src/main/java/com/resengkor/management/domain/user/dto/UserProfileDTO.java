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
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;

    @Builder
    public UserProfileDTO(Long id, String name, String address, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
