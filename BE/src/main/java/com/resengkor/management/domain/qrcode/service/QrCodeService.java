package com.resengkor.management.domain.qrcode.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@Service
public class QrCodeService {

    private final JwtTokenService jwtTokenService;

    @Autowired
    public QrCodeService(JwtTokenService jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }

    // QR 코드 이미지를 Base64로 인코딩한 데이터를 반환
    public String generateQrCode(String username) throws WriterException, IOException {
        // Redis에서 JWT 토큰을 가져옴
        Optional<String> jwtTokenOpt = jwtTokenService.getToken(username);

        // 토큰이 없을 경우 예외 처리
        if (jwtTokenOpt.isEmpty()) {
            throw new IllegalArgumentException("Token not found for user: " + username);
        }

        String jwtToken = jwtTokenOpt.get();
        String url = "https://yourdomain.com/verify?token=" + jwtToken; // 토큰 포함 URL 생성

        // QR 코드 생성
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, 300, 300);

        // Base64로 인코딩
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        return Base64.getEncoder().encodeToString(pngData);
    }
}
