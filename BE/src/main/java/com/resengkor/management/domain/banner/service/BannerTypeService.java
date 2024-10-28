package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.dto.BannerTypeDto;
import com.resengkor.management.domain.banner.entity.BannerType;
import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerTypeService {

    private final BannerTypeRepository bannerTypeRepository;

    public List<BannerTypeDto> getManagedBanners(Long userId) {
        List<BannerType> banners = bannerTypeRepository.findByUserId(userId);
        return banners.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private BannerTypeDto mapToDto(BannerType banner) {
        return new BannerTypeDto(
                banner.getTypeWidth(),
                banner.getHorizontalLength(),
                banner.getHorizontalLength() == 120 ? "정단" : "비정단",
                banner.getQuantity()
        );
    }
}
