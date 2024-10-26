package com.resengkor.management.domain.qrcode.service;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import com.resengkor.management.domain.banner.mapper.BannerRequestMapper;
import com.resengkor.management.domain.banner.repository.BannerRequestRepository;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import net.glxn.qrgen.javase.QRCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
public class QrCodeCreationService {

    private BannerRequestRepository bannerRequestRepository;
    private BannerRequestMapper bannerRequestMapper;


    @Autowired
    public QrCodeCreationService(BannerRequestRepository bannerRequestRepository, BannerRequestMapper bannerRequestMapper) {
        this.bannerRequestRepository = bannerRequestRepository;
        this.bannerRequestMapper = bannerRequestMapper;
    }

    public byte[] generateQRCode(QrPageDataDTO qrPageDataDTO) {
        String uuid = UUID.randomUUID().toString();

        // MapStruct를 사용하여 DTO -> Entity 변환
        BannerRequest bannerRequest = bannerRequestMapper.toBannerRequest(qrPageDataDTO).toBuilder()
                .uuid(uuid)
                .build();

        bannerRequestRepository.save(bannerRequest);

        // QR 코드 생성 로직
        String qrUrl = "https://reseng.co.kr/validateQR?uuid=" + uuid;
        ByteArrayOutputStream stream = QRCode.from(qrUrl).withSize(250, 250).stream();

        return stream.toByteArray();
    }
}
