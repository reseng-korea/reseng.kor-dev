package com.resengkor.management.domain.qrcode.controller;

import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import com.resengkor.management.domain.qrcode.service.QRCodeValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class QRCodeValidationController {

    private final QRCodeValidationService qrCodeValidationService;

    @Autowired
    public QRCodeValidationController(QRCodeValidationService qrCodeValidationService) {
        this.qrCodeValidationService = qrCodeValidationService;
    }

    /**
     * 주어진 uuid를 기반으로 QR 코드를 유효성 검사하고, 유효한 경우 데이터를 반환합니다.
     *
     * @param uuid QR 코드의 고유 식별자
     * @return QR 코드에 연결된 BannerRequestDTO 데이터 또는 404 상태
     */
    @GetMapping("/qr-code")
    public ResponseEntity<QrPageDataDTO> validateQRCode(@RequestParam String uuid) {
        QrPageDataDTO qrPageDataDTO = qrCodeValidationService.validateQRCode(uuid);
        if (qrPageDataDTO != null) {
            return ResponseEntity.ok(qrPageDataDTO); // 유효한 QR 코드일 경우 데이터 반환
        } else {
            return ResponseEntity.status(404).body(null); // 유효하지 않은 QR 코드일 경우 404 반환
        }
    }
}
