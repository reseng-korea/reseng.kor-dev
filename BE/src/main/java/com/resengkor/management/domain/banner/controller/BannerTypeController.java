package com.resengkor.management.domain.banner.controller;

import com.resengkor.management.domain.banner.dto.BannerInventoryDto;
import com.resengkor.management.domain.banner.service.BannerTypeService;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class BannerTypeController {

    private final BannerTypeService bannerTypeService;

    // 보유 현수막 전체 재고 조회 API
    @GetMapping
    public ResponseEntity<List<BannerInventoryDto>> getBannerInventory() {
        List<BannerInventoryDto> inventoryList = bannerTypeService.getBannerInventory();
        return ResponseEntity.ok(inventoryList);
    }

    // 보유 현수막 특정 폭(width) 재고 조회 API
    @GetMapping("/{typeWidth}")
    public BannerInventoryDto getBannerInventoryBySpecificWidth(@PathVariable Integer typeWidth) {
        return bannerTypeService.getBannerInventoryBySpecificWidth(typeWidth);
    }

    // 현수막 길이 수정 API
//    @PatchMapping("/use-yards")
//    public ResponseEntity<String> useBannerYards(@RequestBody QrPageDataDTO qrPageDataDTO) {
//        try {
//            bannerTypeService.useBannerYards(qrPageDataDTO);
//            return ResponseEntity.ok("Banner length updated successfully.");
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
}
