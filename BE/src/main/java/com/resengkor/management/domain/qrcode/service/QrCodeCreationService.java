package com.resengkor.management.domain.qrcode.service;

import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class QrCodeCreationService {

    // QR 코드 이미지를 Base64로 인코딩한 데이터를 반환
    public String generateQrCode(String username) throws WriterException, IOException {
        // Redis에서 JWT 토큰을 가져옴

        // 토큰이 없을 경우 예외 처리

        // QR 코드 생성
        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        // Base64로 인코딩
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        byte[] pngData = pngOutputStream.toByteArray();

        return Base64.getEncoder().encodeToString(pngData);
    }
}
