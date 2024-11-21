package com.resengkor.management.domain.order.dto;

import com.resengkor.management.domain.banner.dto.BannerOrderItemDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDto {

    private List<BannerOrderItemDto> bannerRequests;  // 배너 요청 정보

}
