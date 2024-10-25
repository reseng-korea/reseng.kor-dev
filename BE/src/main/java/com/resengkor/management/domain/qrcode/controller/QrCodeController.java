package com.resengkor.management.domain.qrcode.controller;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.repository.BannerRequestRepository;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.security.jwt.util.JWTUtil;
import net.glxn.qrgen.javase.QRCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

@RestController
public class QrCodeController {

    private final BannerRequestRepository bannerRequestRepository;
    private final BannerTypeRepository bannerTypeRepository;
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;

    @Autowired
    public QrCodeController(BannerRequestRepository bannerRequestRepository, BannerTypeRepository bannerTypeRepository, UserRepository userRepository, JWTUtil jwtUtil) {
        this.bannerRequestRepository = bannerRequestRepository;
        this.bannerTypeRepository = bannerTypeRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(value = "/generateQR", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQRCode(@RequestHeader("Authorization") String token, @RequestBody QrPageDataDTO qrPageDataDTO) {
        // 현재 인증된 사용자의 이메일 가져오기
        String email = jwtUtil.getEmail(token);
        User user = userRepository.findByEmail(email);

        // 고유한 UUID 생성
        String uuid = UUID.randomUUID().toString();

        // BannerType 가져오기
        BannerType bannerType = bannerTypeRepository.findBannerTypeBy(qrPageDataDTO.getTypeWidth())
                .orElseThrow(() -> new RuntimeException("Not found banner type"));

        // DTO -> Entity 변환
        BannerRequest bannerRequest = BannerRequest.builder()
                .uuid(uuid)
                .requestedLength(qrPageDataDTO.getRequestedLength())
                .requestedDate(qrPageDataDTO.getRequestedDate())
                .clientName(qrPageDataDTO.getClientName())
                .postedDate(qrPageDataDTO.getPostedDate())
                .postedDuration(null)
                .postedLocation(qrPageDataDTO.getPostedLocation())
                .bannerType(bannerType)
                .user(user)
                .build();

        // 데이터베이스에 QR 코드 데이터 저장
        bannerRequestRepository.save(bannerRequest);

        // QR 코드 URL 생성
        String qrUrl = "https://reseng.co.kr/validateQR?uuid=" + uuid;
        ByteArrayOutputStream stream = QRCode.from(qrUrl).withSize(250, 250).stream();

        // QR 코드 이미지 반환
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(stream.toByteArray());
    }
}
