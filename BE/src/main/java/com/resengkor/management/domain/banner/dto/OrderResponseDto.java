package com.resengkor.management.domain.banner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class OrderResponseDto {

    private String agencyName;           // 대리점 이름
    private LocalDate orderDate;         // 발주 날짜
    private String status;               // 상태 확인 정보
    private List<BannerOrderItemDto> bannerRequests;  // 배너 요청 정보
}
