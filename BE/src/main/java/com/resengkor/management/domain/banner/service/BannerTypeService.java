package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.BannerInventoryDTO;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.global.security.jwt.dto.CustomUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerTypeService {

    private final BannerTypeRepository bannerTypeRepository;

    public List<BannerInventoryDTO> getBannerInventory(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<BannerType> banners = bannerTypeRepository.findByUserId(userId);

        // 각 typeWidth에 대한 정단 및 비정단 정보를 BannerInventoryDTO 형태로 변환
        Map<Integer, List<BannerType>> bannersByTypeWidth = banners.stream()
                .collect(Collectors.groupingBy(BannerType::getTypeWidth));

        List<BannerInventoryDTO> inventoryList = new ArrayList<>();
        bannersByTypeWidth.forEach((typeWidth, bannerList) -> {
            int standardCount = 0;
            List<Integer> allLengths = new ArrayList<>();
            List<Integer> nonStandardLengths = new ArrayList<>();

            for (BannerType banner : bannerList) {
                for (int i = 0; i < banner.getQuantity(); i++) {
                    allLengths.add(banner.getHorizontalLength());
                }
                // 정단 현수막인 경우 standardCount 증가
                if (banner.getHorizontalLength() == 120) {
                    standardCount += banner.getQuantity();
                }
            }

            // 중복 제거 후 horizontalLength 기준으로 오름차순 정렬
            allLengths = allLengths.stream().sorted().collect(Collectors.toList());
            inventoryList.add(new BannerInventoryDTO(typeWidth, standardCount, allLengths));
        });

        return inventoryList;
    }

    // 특정 typeWidth에 대한 배너 인벤토리를 horizontalLength 기준 오름차순으로 정렬하여 반환
    public BannerInventoryDTO getBannerInventoryBySpecificWidth(Authentication authentication, Integer typeWidth) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<BannerType> banners = bannerTypeRepository.findByUserIdAndTypeWidth(userId, typeWidth);

        List<Integer> allLengths = new ArrayList<>();

        for (BannerType banner : banners) {
            // 모든 현수막의 horizontalLength를 추가 (정단/비정단 포함)
            for (int i = 0; i < banner.getQuantity(); i++) {
                allLengths.add(banner.getHorizontalLength());
            }
        }

        // 중복 제거 후 horizontalLength 기준으로 오름차순 정렬
        allLengths = allLengths.stream().sorted().collect(Collectors.toList());

        // 정단 개수를 allLengths 리스트에서 계산
        int standardCount = (int) allLengths.stream().filter(length -> length == 120).count();
        return new BannerInventoryDTO(typeWidth, standardCount, allLengths);
    }

    // 현수막 사용 요청을 처리하여 재고 업데이트
    @Transactional
    public void useBannerYards(Authentication authentication, Integer typeWidth, int horizontalLength, int yardToUse) {
        Long userId = getUserIdFromAuthentication(authentication);

        // 해당 조건의 배너 조회
        BannerType banner = bannerTypeRepository.findByUserIdAndTypeWidthAndHorizontalLength(
                userId, typeWidth, horizontalLength);

        if (banner != null) {
            int remainingYards = banner.getQuantity() - yardToUse;
            if (remainingYards >= 0) {
                // 기존 객체의 quantity 값만 변경
                banner = BannerType.builder()
                        .id(banner.getId())
                        .typeWidth(banner.getTypeWidth())
                        .horizontalLength(banner.getHorizontalLength())
                        .isStandard(banner.getIsStandard())
                        .quantity(remainingYards) // 업데이트된 quantity 값 설정
                        .user(banner.getUser())
                        .build();

                bannerTypeRepository.save(banner);
            } else {
                throw new IllegalArgumentException("사용할 수 있는 갈아가 부족합니다.");
            }
        } else {
            throw new IllegalArgumentException("해당 조건에 맞는 정단 현수막을 찾을 수 없습니다.");
        }
    }

    // 새로운 현수막 추가 메서드 (정단/비정단 추가에 따른 로직)
//    public void addNewBanner(Authentication authentication, Integer typeWidth, int horizontalLength, int quantity) {
//        Long userId = getUserIdFromAuthentication(authentication);
//        BannerType newBanner = new BannerType();
//        newBanner.setUserId(userId);
//        newBanner.setTypeWidth(typeWidth);
//        newBanner.setHorizontalLength(horizontalLength);
//        newBanner.setQuantity(quantity);
//
//        // 기존의 standardCount 계산 로직과 일관성을 유지하기 위해 저장 전에 추가 로직 처리
//        if (horizontalLength == 120) {
//            // 정단 현수막인 경우 quantity만큼 standardCount 증가
//            newBanner.setQuantity(newBanner.getQuantity() + quantity);
//        }
//
//        bannerTypeRepository.save(newBanner);
//    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        // CustomUserDetails 객체에서 사용자 ID(Long)를 올바르게 가져오는 방법
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserId();
    }
}
