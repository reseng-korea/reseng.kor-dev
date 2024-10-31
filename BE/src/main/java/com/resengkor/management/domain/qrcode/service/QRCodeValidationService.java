package com.resengkor.management.domain.qrcode.service;

import com.resengkor.management.domain.banner.mapper.BannerRequestMapper;
import com.resengkor.management.domain.banner.repository.BannerRequestRepository;
import com.resengkor.management.domain.qrcode.QrRepository.QrRepository;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class QRCodeValidationService {

    private final BannerRequestRepository bannerRequestRepository;
    private final QrRepository qrRepository;
    private final BannerRequestMapper bannerRequestMapper;

    /**
     * 주어진 uuid에 해당하는 QR이 존재하고, 만료되지 않은 경우
     * 관련 BannerRequest 정보를 BannerRequestDTO로 변환하여 반환합니다.
     *
     * @param uuid QR 코드의 고유 식별자
     * @return QrPageDataDTO 또는 null (uuid가 유효하지 않거나 만료된 경우)
     */
    public QrPageDataDTO validateQRCode(String uuid) {
        return qrRepository.findByUuid(uuid)
                .filter(qr -> qr.getExpiredAt().isAfter(LocalDateTime.now())) // 만료 여부 확인
                .map(qr -> bannerRequestRepository.findById(qr.getBannerRequest().getId())
                        .map(bannerRequestMapper::toBannerRequestDTO)
                        .orElse(null)
                ).orElse(null);
    }
}
