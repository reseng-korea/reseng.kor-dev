package com.resengkor.management.domain.banner.dto;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class OrderRequestDto {

    private List<BannerRequest> bannerRequests;  // 배너 요청 정보

}
