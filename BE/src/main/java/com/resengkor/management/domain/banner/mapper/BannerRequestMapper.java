package com.resengkor.management.domain.banner.mapper;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.time.Period;

@Mapper (componentModel = "spring")
public interface BannerRequestMapper {

    // Mapper 인스턴스 (기본적인 방식, Spring을 통해 주입받으므로 사용하지 않아도 됨)
    BannerRequestMapper INSTANCE = Mappers.getMapper(BannerRequestMapper.class);


    // Entity -> DTO 변환 메서드 (horizontalLength 제외)
    @Mapping(source = "user.companyName", target = "company")
    @Mapping(source = "bannerType.typeWidth", target = "typeWidth")
    @Mapping(target = "horizontalLength", qualifiedByName = "roundDoubleToInteger", ignore = true) // horizontalLength 필드 제외
    @Mapping(source = "postedDuration", target = "postedDuration", qualifiedByName = "mapPeriodToInteger", ignore = true)
    QrPageDataDTO toBannerRequestDTOWithoutHorizontalLengthAndPostedDuration(BannerRequest bannerRequest);

    // DTO -> Entity 변환 메서드
    @Mapping(target = "user.companyName", source = "company")
    @Mapping(target = "bannerType.typeWidth", source = "typeWidth")
    @Mapping(source = "postedDuration", target = "postedDuration", qualifiedByName = "mapIntegerToPeriod")
    @Mapping(source = "requestedLength", target = "requestedLength")
    BannerRequest toBannerRequest(QrPageDataDTO bannerRequestDTO);

    // 1.092 곱한 후 Double로 변환하는 헬퍼 메서드 (DTO -> Entity 변환)
    @Named("adjustAndRoundLength")
    default Double adjustAndRoundLength(Integer length) {
        return length != null ? length * 1.092 : null;
    }

    // Double을 Integer로 반올림하여 변환하는 헬퍼 메서드 (Entity -> DTO 변환)
    @Named("roundDoubleToInteger")
    default Integer roundDoubleToInteger(Double length) {
        return length != null ? (int) Math.round(length) : null;
    }

    // Period -> Integer 변환 헬퍼 메서드
    @Named("mapPeriodToInteger")
    default Integer mapPeriodToInteger(Period period) {
        return period != null ? period.getDays() : null;
    }

    // Integer -> Period 변환 헬퍼 메서드
    @Named("mapIntegerToPeriod")
    default Period mapIntegerToPeriod(Integer days) {
        return days != null ? Period.ofDays(days) : null;
    }
}
