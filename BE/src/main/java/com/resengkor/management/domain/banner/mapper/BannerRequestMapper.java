package com.resengkor.management.domain.banner.mapper;

import com.resengkor.management.domain.banner.entity.BannerRequest;
import com.resengkor.management.domain.qrcode.dto.QrPageDataDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    // 1.094 곱한 후 BigDecimal로 변환하는 헬퍼 메서드 (DTO -> Entity 변환)
    @Named("adjustAndRoundLength")
    default BigDecimal adjustAndRoundLength(Long length) {
        return length != null
                ? BigDecimal.valueOf(length).multiply(BigDecimal.valueOf(1.094)).setScale(6, RoundingMode.HALF_UP)
                : null;
    }

    // BigDecimal을 Integer로 반올림하여 변환하는 헬퍼 메서드 (Entity -> DTO 변환)
    @Named("roundBigDecimalToInteger")
    default Integer roundBigDecimalToInteger(BigDecimal length) {
        return length != null ? (int) length.setScale(0, RoundingMode.HALF_UP).intValue() : null;
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
