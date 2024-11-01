package com.resengkor.management.domain.banner.controller;

import com.resengkor.management.domain.banner.dto.BannerInventoryDTO;
import com.resengkor.management.domain.banner.service.BannerTypeService;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    // 현수막 길이 수정 API
    @PatchMapping("/use-yards")
    public ResponseEntity<String> useBannerYards(
            Authentication authentication,
            @RequestBody QrPageDataDTO qrPageDataDTO)
    {
        try {
            bannerTypeService.useBannerYards(authentication, qrPageDataDTO);
            return ResponseEntity.ok("Banner yards updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
