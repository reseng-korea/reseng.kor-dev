package com.resengkor.management.domain.user.dto;

import com.resengkor.management.domain.user.entity.Region;
import lombok.Builder;
import lombok.Data;

@Data
public class RegionDTO {
    private Long id;
    private String regionName;
    private String regionType;

    @Builder
    public RegionDTO(Long id, String regionName, String regionType) {
        this.id = id;
        this.regionName = regionName;
        this.regionType = regionType;
    }

    public static RegionDTO fromEntity(Region region) {
        return RegionDTO.builder()
                .id(region.getId())
                .regionName(region.getRegionName())
                .regionType(region.getRegionType())
                .build();
    }
}
