package com.resengkor.management.domain.qrcode.controller;

import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import com.resengkor.management.domain.qrcode.service.QrPageDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class QrPageDataController {

    private final QrPageDataService qrPageDataService;

    @Autowired
    public QrPageDataController(QrPageDataService qrPageDataService) {
        this.qrPageDataService = qrPageDataService;
    }

    // JWT 유효성 검증 메서드
    // JWT 토큰에서 사용자 ID 추출 메서드

    // QR 코드를 통해 접근한 페이지에서 데이터 조회
    @GetMapping("/data")
    public ResponseEntity<QrPageDataDTO> getQrPageData(@RequestParam Long bannerRequestId) {
        QrPageDataDTO qrPageDataDTO = qrPageDataService.getQrPageDate(bannerRequestId);
        return ResponseEntity.ok(qrPageDataDTO);
    }

    // QR 코드를 통해 데이터를 저장하는 엔드포인트
    @PostMapping("/save")
    public ResponseEntity<String> saveQrPageData(@RequestBody QrPageDataDTO qrPageDataDTO) {
        qrPageDataService.saveQrPageData(qrPageDataDTO);
        return ResponseEntity.ok("Data saved successfully");
    }
}
