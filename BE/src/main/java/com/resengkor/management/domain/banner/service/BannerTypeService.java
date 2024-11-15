package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.BannerInventoryDto;
import com.resengkor.management.domain.banner.dto.SelectedBannerRequestDto;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.mapper.BannerRequestMapper;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class BannerTypeService {
    // repository
    private final BannerTypeRepository bannerTypeRepository;
    // mapper
    private final BannerRequestMapper bannerRequestMapper;

    // 보유 현수막 전체 재고 조회
    public List<BannerInventoryDto> getBannerInventory() {
        // 현재 로그인된 사용자의 ID를 가져옴
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        List<BannerType> banners = bannerTypeRepository.findByUserId(userId);

        // 각 typeWidth에 대한 정단 및 비정단 정보를 BannerInventoryDTO 형태로 변환
        Map<Integer, List<BannerType>> bannersByTypeWidth = banners.stream()
                .collect(Collectors.groupingBy(BannerType::getTypeWidth));

        List<BannerInventoryDto> inventoryList = new ArrayList<>();
        bannersByTypeWidth.forEach((typeWidth, bannerList) -> {
            int standardCount = 0;
            // 각 배너의 길이를 정수로 변환하고 오름차순으로 정렬된 리스트 생성
            List<Integer> allLengths = bannerList.stream()
                    .map(banner -> bannerRequestMapper.INSTANCE.roundBigDecimalToInteger(banner.getHorizontalLength()))
                    .sorted()
                    .distinct() // 중복 제거
                    .collect(Collectors.toList());

            // 정단 현수막인 경우 standardCount 증가
            for (int length : allLengths) {
                if (length == 120) {
                    standardCount++;
                }
            }
            inventoryList.add(new BannerInventoryDto(typeWidth, standardCount, allLengths));
        });
        // typeWidth 기준으로 오름차순 정렬
        inventoryList.sort(Comparator.comparingInt(BannerInventoryDto::getTypeWidth));
        return inventoryList;
    }

    // 특정 typeWidth에 대한 배너 인벤토리를 horizontalLength 기준 오름차순으로 정렬하여 반환
    public BannerInventoryDto getBannerInventoryBySpecificWidth(Integer typeWidth) {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        List<BannerType> banners = bannerTypeRepository.findByUserIdAndTypeWidth(userId, typeWidth);
        List<Integer> allLengths = new ArrayList<>();

        for (BannerType banner : banners) {
            // 각 배너의 horizontalLength를 추가
            int roundedLength = bannerRequestMapper.INSTANCE.roundBigDecimalToInteger(banner.getHorizontalLength());
            allLengths.add(roundedLength);
        }
        // 중복 제거 후 horizontalLength 기준으로 오름차순 정렬
        allLengths = allLengths.stream().sorted().collect(Collectors.toList());
        // 정단 개수를 allLengths 리스트에서 계산
        int standardCount = (int) allLengths.stream().filter(length -> length == 120).count();
        return new BannerInventoryDto(typeWidth, standardCount, allLengths);
    }

    // 현수막 사용 요청을 처리하여 재고 업데이트
    @Transactional
    public void useBannerYards(QrPageDataDTO qrPageDataDTO) {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        // SelectedBannerRequestDto 생성
        SelectedBannerRequestDto selectedBannerRequestDto = new SelectedBannerRequestDto(
                qrPageDataDTO.getTypeWidth(),
                qrPageDataDTO.getHorizontalLength()
        );

        // 선택된 typeWidth, horizontalLength로 BannerType 조회
        BannerType bannerType = findMatchingBannerType(userId, selectedBannerRequestDto);

        if (bannerType != null) {
            // 선택된 현수막 - 요청 현수막 길이 * 1.094
            BigDecimal remainingYards = bannerType.getHorizontalLength().subtract(BigDecimal.valueOf(qrPageDataDTO.getRequestedLength()).multiply(BigDecimal.valueOf(1.094)));
            if (remainingYards.compareTo(BigDecimal.ZERO) >= 0) {
                // 재고 업데이트, 기존 객체의 horizontalLength 값만 변경
                bannerType = BannerType.builder()
                        .id(bannerType.getId())
                        .typeWidth(bannerType.getTypeWidth())
                        .horizontalLength(remainingYards) // 업데이트된 horizontalLength 값 설정
                        .isStandard(bannerType.getIsStandard())
                        .user(bannerType.getUser())
                        .build();

                bannerTypeRepository.save(bannerType);
            } else {
                throw new CustomException(ExceptionStatus.INSUFFICIENT_BANNER_LENGTH);
            }
        } else {
            throw new CustomException(ExceptionStatus.BANNER_NOT_MATCHING_CONDITION);
        }
    }

//  horizontalLength를 변환했을때 가장 가까운 BannerType을 반환
    // userId, horizontalLength, typeWidth이 일치하는 bannerType 반환
    public BannerType findMatchingBannerType(Long userId, SelectedBannerRequestDto selectedBannerRequestDto) {
        // 선택된 horizontalLength를 조정 (1.092 곱한 후 반올림하여 BigDecimal로 변환)
        BigDecimal adjustedHorizontalLength = BannerRequestMapper.INSTANCE.adjustAndRoundLength(selectedBannerRequestDto.getHorizontalLength());

        return bannerTypeRepository.findClosestByUserIdAndTypeWidth(
                userId,
                selectedBannerRequestDto.getTypeWidth(),
                adjustedHorizontalLength,
                PageRequest.of(0, 1) // 가장 가까운 하나만 조회
        ).stream().findFirst().orElseThrow(() -> new CustomException(ExceptionStatus.BANNER_NOT_FOUND));
    }
}