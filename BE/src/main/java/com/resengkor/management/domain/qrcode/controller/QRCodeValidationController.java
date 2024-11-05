package com.resengkor.management.domain.qrcode.controller;

import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import com.resengkor.management.domain.qrcode.service.QRCodeValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class QRCodeValidationController {

    private final QRCodeValidationService qrCodeValidationService;

    /**
     * 주어진 UUID를 기반으로 QR 코드의 유효성을 검사하고, 유효한 경우 연결된 데이터를 반환합니다.
     *
     * @param uuid QR 코드의 고유 식별자
     * @return QR 코드에 연결된 QrPageDataDTO 데이터 또는 404 상태
     */
    @GetMapping("/qr-code")
    public ResponseEntity<QrPageDataDTO> validateQRCode(@RequestParam String uuid) {
        QrPageDataDTO qrPageDataDTO = qrCodeValidationService.validateQRCode(uuid);
        return ResponseEntity.ok(qrPageDataDTO);
    }
}
