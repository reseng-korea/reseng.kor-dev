package com.resengkor.management.domain.banner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class BannerInventoryDTO {

    private Integer typeWidth;
    private Integer standardCount; // 정단 개수
    private List<Integer> nonStandardLengths; // 비정단 길이 목록

}
