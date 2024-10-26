package com.resengkor.management.domain.banner.mapper;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper (componentModel = "spring")
public interface BannerRequestMapper {

    // Mapper 인스턴스 (기본적인 방식, Spring을 통해 주입받으므로 사용하지 않아도 됨)
    BannerRequestMapper INSTANCE = Mappers.getMapper(BannerRequestMapper.class);

    // Entity -> DTO 변환 메서드
    @Mapping(source = "user.companyName", target = "companyName")
    @Mapping(source = "bannerType.typeWidth", target = "width")
    QrPageDataDTO toBannerRequestDTO(BannerRequest bannerRequest);

    // DTO -> Entity 변환 메서드
    @Mapping(target = "user.companyName", source = "companyName")
    @Mapping(target = "bannerType.typeWidth", source = "width")
    BannerRequest toBannerRequest(QrPageDataDTO bannerRequestDTO);
}
