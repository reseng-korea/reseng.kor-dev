package com.resengkor.management.domain.banner.mapper;

import com.resengkor.management.domain.banner.dto.OrderResponseDto;
import com.resengkor.management.domain.banner.entity.OrderHistory;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface OrderHistoryMapper {

    // Mapper 인스턴스 (기본적인 방식, Spring을 통해 주입받으므로 사용하지 않아도 됨)
    BannerRequestMapper INSTANCE = Mappers.getMapper(BannerRequestMapper.class);

    // 단일 OrderHistory -> OrderResponseDto 변환
    OrderResponseDto toDto(OrderHistory orderHistory);

    // OrderHistory 리스트 -> OrderResponseDto 리스트 변환
    default List<OrderResponseDto> toDtoList(List<OrderHistory> orderHistories) {
        return orderHistories.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
