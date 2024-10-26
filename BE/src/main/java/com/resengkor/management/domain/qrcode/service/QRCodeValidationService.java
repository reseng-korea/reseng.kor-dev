package com.resengkor.management.domain.qrcode.service;

import com.resengkor.management.domain.banner.mapper.BannerRequestMapper;
import com.resengkor.management.domain.banner.repository.BannerRequestRepository;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QRCodeValidationService {

    private final BannerRequestRepository bannerRequestRepository;
    private final BannerRequestMapper bannerRequestMapper;

    @Autowired
    public QRCodeValidationService(BannerRequestRepository bannerRequestRepository, BannerRequestMapper bannerRequestMapper) {
        this.bannerRequestRepository = bannerRequestRepository;
        this.bannerRequestMapper = bannerRequestMapper;
    }

    /**
     * 주어진 uuid에 해당하는 BannerRequest가 존재하는지 확인하고,
     * 존재할 경우 BannerRequestDTO로 변환하여 반환합니다.
     *
     * @param uuid QR 코드의 고유 식별자
     * @return BannerRequestDTO 또는 null (uuid가 유효하지 않은 경우)
     */
    public QrPageDataDTO validateQRCode(String uuid) {
        return bannerRequestRepository.findByUuid(uuid)
                .map(bannerRequestMapper::toBannerRequestDTO) // Entity -> DTO 변환
                .orElse(null);
    }
}
