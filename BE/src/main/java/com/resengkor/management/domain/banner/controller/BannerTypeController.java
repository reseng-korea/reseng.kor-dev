package com.resengkor.management.domain.banner.controller;

import com.resengkor.management.domain.banner.dto.BannerInventoryDTO;
import com.resengkor.management.domain.banner.service.BannerTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BannerTypeController {

    private final BannerTypeService bannerTypeService;

    // 보유 현수막 재고 조회 API
    @GetMapping("/inventory")
    public ResponseEntity<List<BannerInventoryDTO>> getBannerInventory(Authentication authentication) {
        List<BannerInventoryDTO> inventoryList = bannerTypeService.getBannerInventory(authentication);
        return ResponseEntity.ok(inventoryList);
    }
}
