package com.resengkor.management.domain.banner.controller;

import com.resengkor.management.domain.banner.dto.BannerInventoryDTO;
import com.resengkor.management.domain.banner.service.BannerTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class BannerTypeController {

    private final BannerTypeService bannerTypeService;

    // 보유 현수막 전체 재고 조회 API
    @GetMapping
    public ResponseEntity<List<BannerInventoryDTO>> getBannerInventory(Authentication authentication) {
        List<BannerInventoryDTO> inventoryList = bannerTypeService.getBannerInventory(authentication);
        return ResponseEntity.ok(inventoryList);
    }

    // 보유 현수막 특정 폭(width) 재고 조회 API
    @GetMapping("/{typeWidth}")
    public BannerInventoryDTO getBannerInventoryBySpecificWidth(Authentication authentication, @PathVariable Integer typeWidth) {
        return bannerTypeService.getBannerInventoryBySpecificWidth(authentication, typeWidth);
    }
}
