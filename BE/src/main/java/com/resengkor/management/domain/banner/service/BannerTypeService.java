package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.BannerInventoryDTO;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
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
            List<Integer> nonStandardLengths = new ArrayList<>();

            for (BannerType banner : bannerList) {
                if (banner.getHorizontalLength() == 120) {
                    standardCount += banner.getQuantity();
                } else {
                    nonStandardLengths.add(banner.getHorizontalLength());
                }
            }

            nonStandardLengths = nonStandardLengths.stream().distinct().collect(Collectors.toList());
            inventoryList.add(new BannerInventoryDTO(typeWidth, standardCount, nonStandardLengths));
        });

        return inventoryList;
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        // authentication 객체에서 userId를 추출하는 로직
        return (Long) authentication.getPrincipal(); // 사용자 정의 방식에 따라 수정 필요
    }
}
