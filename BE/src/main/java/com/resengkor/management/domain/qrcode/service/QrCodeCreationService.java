package com.resengkor.management.domain.qrcode.service;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.mapper.BannerRequestMapper;
import com.resengkor.management.domain.banner.repository.BannerRequestRepository;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.qrcode.QrRepository.QrRepository;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import com.resengkor.management.domain.qrcode.entity.QR;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import lombok.RequiredArgsConstructor;
import net.glxn.qrgen.javase.QRCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class QrCodeCreationService {

    private final UserRepository userRepository;
    private final BannerRequestRepository bannerRequestRepository;
    private final BannerTypeRepository bannerTypeRepository;
    private final QrRepository qrRepository;
    private final BannerRequestMapper bannerRequestMapper;

    public byte[] generateQRCode(QrPageDataDTO qrPageDataDTO) {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long userId = UserAuthorizationUtil.getLoginMemberId();

        // ID를 기반으로 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("로그인한 사용자를 찾을 수 없습니다."));

        // qrPageDataDTO에 로그인 된 사용자의 companyName을 설정
        qrPageDataDTO = qrPageDataDTO.toBuilder()
                .company(user.getCompanyName())
                .build();

        // 선택된 typeWidth로 BannerType 조회
        BannerType bannerType = bannerTypeRepository.findByTypeWidthAndHorizontalLength(qrPageDataDTO.getTypeWidth(), qrPageDataDTO.getHorizontalLength())
                .orElseThrow(() -> new IllegalArgumentException("해당 폭의 현수막을 찾을 수 없습니다."));

        // MapStruct를 사용하여 DTO -> Entity 변환
        BannerRequest bannerRequest = bannerRequestMapper.toBannerRequest(qrPageDataDTO).toBuilder()
                .user(user)
                .bannerType(bannerType)
                .build();

        bannerRequestRepository.save(bannerRequest);

        // uuid 및 QR url 생성
        String uuid = UUID.randomUUID().toString();
        String qrUrl = "https://reseng.co.kr/validateQR?uuid=" + uuid;

        // QR 코드 생성
        ByteArrayOutputStream stream = QRCode.from(qrUrl).withSize(250, 250).stream();

        LocalDateTime now = LocalDateTime.now();
//        LocalDateTime expirationDate = now.plusWeeks(2); // 유효기간 2주 설정
        LocalDateTime expirationDate = now.plusDays(qrPageDataDTO.getPostedDuration()); // 유효기간 8일 설정

        QR qr = QR.builder()
                .uuid(uuid)
                .createdAt(now)
                .expiredAt(expirationDate)
                .generatedUrl(qrUrl)
                .bannerRequest(bannerRequest)
                .build();

        qrRepository.save(qr);

        return stream.toByteArray();
    }
}
