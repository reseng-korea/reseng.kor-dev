package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.BannerInventoryDTO;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerTypeService {

    private final BannerTypeRepository bannerTypeRepository;

    public List<BannerInventoryDTO> getBannerInventory(Long userId) {
        List<BannerType> banners = bannerTypeRepository.findByUserId(userId);

        // typeWidth별로 그룹핑된 데이터를 담을 Map
        Map<Integer, List<BannerType>> bannersByTypeWidth = banners.stream()
                .collect(Collectors.groupingBy(BannerType::getTypeWidth));

        // 각 typeWidth에 대한 정단 및 비정단 정보를 BannerInventoryDto 형태로 변환
        List<BannerInventoryDTO> inventoryList = new ArrayList<>();

        bannersByTypeWidth.forEach((typeWidth, bannerList) -> {
            int standardCount = 0;
            List<Integer> nonStandardLengths = new ArrayList<>();

            for (BannerType banner : bannerList) {
                if (banner.getHorizontalLength() == 120) {
                    // 정단인 경우 개수를 누적
                    standardCount += banner.getQuantity();
                } else {
                    // 비정단인 경우 해당 길이를 리스트에 추가
                    nonStandardLengths.add(banner.getHorizontalLength());
                }
            }

            // 비정단 길이 목록에서 중복을 제거
            nonStandardLengths = nonStandardLengths.stream().distinct().collect(Collectors.toList());

            // 결과를 BannerInventoryDto에 추가
            inventoryList.add(new BannerInventoryDTO(typeWidth, standardCount, nonStandardLengths));
        });

        return inventoryList;
    }


}
