package com.resengkor.management.domain.qrcode.controller;

import com.resengkor.management.domain.banner.service.BannerTypeService;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import com.resengkor.management.domain.qrcode.service.QrCodeCreationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class QrCodeCreationController {

    private final QrCodeCreationService qrCodeCreationService;
    private final BannerTypeService bannerTypeService;

    @PostMapping(value = "/qr-code", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQRCode(@RequestBody QrPageDataDTO qrPageDataDTO) {
        try {
            // 1. 현수막 길이 수정
            bannerTypeService.useBannerYards(qrPageDataDTO);

            // 2. QR 코드 생성
            byte[] qrCodeImage = qrCodeCreationService.generateQRCode(qrPageDataDTO);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(qrCodeImage);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        }
    }
}
