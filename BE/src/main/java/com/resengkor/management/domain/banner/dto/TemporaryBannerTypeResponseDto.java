package com.resengkor.management.domain.banner.dto;

import com.resengkor.management.domain.banner.entity.TemporaryBannerType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder(toBuilder = true)
public class TemporaryBannerTypeResponseDto {

    private Integer temporaryTypeWidth;
    private Integer quantity;

    public TemporaryBannerTypeResponseDto(Integer temporaryTypeWidth, Integer quantity) {
        this.temporaryTypeWidth = temporaryTypeWidth;
        this.quantity = quantity;
    }

    public static TemporaryBannerTypeResponseDto of(TemporaryBannerType temporaryBannerType) {
        return new TemporaryBannerTypeResponseDto(temporaryBannerType.getTemporaryTypeWidth(), temporaryBannerType.getQuantity());
    }
}
