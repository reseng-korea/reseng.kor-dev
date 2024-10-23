package com.resengkor.management.domain.qrcode.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.nio.file.FileSystems;
import java.nio.file.Path;

@Component
public class QrCodeGenerator {

    // QR 코드를 생성하여 바이트 배열로 반환
    public byte[] generateQrCode(String text) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        // 텍스트를 QR 코드로 인코딩하여 BitMatrix로 변환
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 300, 300);

        // BitMatrix를 PNG 형식으로 변환하여 바이트 배열로 반환
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray(); // 바이트 배열 반환
    }

    // QR 코드를 생성하여 파일로 저장 (필요한 경우)
    public void generateQrCodeToFile(String text, String filePath) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 300, 300);

        Path path = FileSystems.getDefault().getPath(filePath);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
    }
}
