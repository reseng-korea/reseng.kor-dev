package com.resengkor.management.domain.banner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BannerTypeDto {

    private Integer typeWidth;
    private Integer horizontalLength;
    private String standardType;
    private Integer quantity;
}
