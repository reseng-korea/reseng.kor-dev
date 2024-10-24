package com.resengkor.management.domain.qrcode.service;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.repository.BannerRequestRepository;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.Principal;


@Service
public class QrPageDataService {

    private final BannerRequestRepository bannerRequestRepository;
    private final BannerTypeRepository bannerTypeRepository;
    private final UserRepository userRepository;

    @Autowired
    public QrPageDataService(BannerRequestRepository bannerRequestRepository, BannerTypeRepository bannerTypeRepository, UserRepository userRepository) {
        this.bannerRequestRepository = bannerRequestRepository;
        this.bannerTypeRepository = bannerTypeRepository;
        this.userRepository = userRepository;
    }

    // BannerRequest 엔티티에서 데이터를 조회해서 DTO로 변환
    public QrPageDataDTO getQrPageDate(Long bannerRequestId) {
        // JWT token 사용해서 본인정보 가져오는 로직으로 User 가져오기.
        // 현재 인증된 사용자 정보를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // JWT 토큰에서 사용자명을 가져오기
        String username = authentication.getName();

//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));

        BannerRequest bannerRequest = bannerRequestRepository.findById(bannerRequestId)
                .orElseThrow(() -> new RuntimeException("Banner request not found"));
        BannerType bannerType = bannerRequest.getBannerType();

        return QrPageDataDTO.builder()
//                .company(user.getCompanyName())
                .requestedLength(bannerRequest.getRequestedLength())
                .typeWidth(bannerType.getTypeWidth())
                .clientName(bannerRequest.getClientName())
                .requestedDate(bannerRequest.getRequestedDate())
                .postedDate(bannerRequest.getPostedDate())
                .postedLocation(bannerRequest.getPostedLocation())
                .build();
    }

    // BannerRequest 에 데이터를 저장하는 로직
    public void saveQrPageData(QrPageDataDTO qrPageDataDTO) {

        // 각 엔티티에 대한 데이터 저장 로직
        BannerType bannerType = BannerType.builder()
                .typeWidth(qrPageDataDTO.getTypeWidth())
                .build();

        bannerTypeRepository.save(bannerType);

        BannerRequest bannerRequest = BannerRequest.builder()
                .requestedLength(qrPageDataDTO.getRequestedLength())
                .requestedDate(qrPageDataDTO.getRequestedDate())
                .clientName(qrPageDataDTO.getClientName())
                .postedDate(qrPageDataDTO.getPostedDate())
                .postedLocation(qrPageDataDTO.getPostedLocation())
                .bannerType(bannerType)
                .build();

        bannerRequestRepository.save(bannerRequest);


    }
}
