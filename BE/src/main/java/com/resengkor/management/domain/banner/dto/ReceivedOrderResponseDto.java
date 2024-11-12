package com.resengkor.management.domain.banner.dto;

import com.resengkor.management.domain.banner.entity.OrderHistory;
import com.resengkor.management.domain.banner.entity.OrderStatus;
import com.resengkor.management.domain.banner.mapper.ReceivedOrderHistoryMapper;
import com.resengkor.management.domain.user.dto.response.UserResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder(toBuilder = true)
@AllArgsConstructor
@RequiredArgsConstructor
public class ReceivedOrderResponseDto {

    private UserResponseDto userResponseDto;        // 대리점 이름
    private LocalDate orderDate;                    // 발주 날짜
    private OrderStatus orderStatus;                // 발주 상태 확인 정보
    private List<TemporaryBannerTypeResponseDto> temporaryBannerTypeResponseDtoList; // 해당 주문에 요청한 현수막 타입 리스트

    // OrderHistoryMapper 인스턴스 생성
    private static final ReceivedOrderHistoryMapper mapper = Mappers.getMapper(ReceivedOrderHistoryMapper.class);

    public static ReceivedOrderResponseDto of(OrderHistory orderHistory) {

        return new ReceivedOrderResponseDto(UserResponseDto.of(orderHistory.getBuyer()),
                orderHistory.getOrderDate(),
                orderHistory.getOrderStatus(),
                mapper.toTemporaryBannerTypeResponseDtoList(orderHistory.getTemporaryBannerTypes())
                );
    }
}
