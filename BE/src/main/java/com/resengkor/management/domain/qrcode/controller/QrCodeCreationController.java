package com.resengkor.management.domain.qrcode.controller;

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

    @PostMapping(value = "/qr-code", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQRCode(@RequestBody QrPageDataDTO qrPageDataDTO) {
        byte[] qrCodeImage = qrCodeCreationService.generateQRCode(qrPageDataDTO);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(qrCodeImage);
    }
}
