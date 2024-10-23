package com.resengkor.management.domain.qrcode.controller;

import com.resengkor.management.domain.qrcode.service.QrCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QrCodeController {

    private final QrCodeGenerator qrCodeGenerator;

    @Autowired
    public QrCodeController(QrCodeGenerator qrCodeGenerator) {
        this.qrCodeGenerator = qrCodeGenerator;
    }

    // QR 코드 생성 요청 처리
    @GetMapping("/generate")
    public ResponseEntity<byte[]> generateQrCode(@RequestParam String text) throws Exception {
        byte[] qrCode = qrCodeGenerator.generateQrCode(text);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(qrCode, headers, HttpStatus.OK);  // PNG 이미지로 응답
    }
}
