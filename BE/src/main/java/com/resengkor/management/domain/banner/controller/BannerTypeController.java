package com.resengkor.management.domain.banner.controller;

import com.resengkor.management.domain.banner.dto.BannerTypeDto;
import com.resengkor.management.domain.banner.service.BannerTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BannerTypeController {

    private final BannerTypeService bannerTypeService;

    @GetMapping("/banner")
    public ResponseEntity<List<BannerTypeDto>> getManagedBanners(@RequestParam Long userId) {
        List<BannerTypeDto> banners = bannerTypeService.getManagedBanners(userId);
        return ResponseEntity.ok(banners);
    }
}
