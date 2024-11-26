package com.resengkor.management.domain.order.dto;

import com.resengkor.management.domain.banner.dto.TemporaryBannerTypeResponseDto;
import com.resengkor.management.domain.order.entity.OrderHistory;
import com.resengkor.management.domain.order.entity.OrderStatus;
import com.resengkor.management.domain.order.mapper.OrderHistoryMapper;
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
public class OrderResponseDto {

    private Long id; // 발주 번호
    private UserResponseDto userResponseDto;        // 대리점 이름
    private LocalDate orderDate;                    // 발주 날짜
    private OrderStatus orderStatus;                // 발주 상태 확인 정보
    private boolean receiveStatus;                  // 수령 상태 확인 정보
    private List<TemporaryBannerTypeResponseDto> temporaryBannerTypeResponseDtoList; // 해당 주문에 요청한 현수막 타입 리스트

    // OrderHistoryMapper 인스턴스 생성
    private static final OrderHistoryMapper mapper = Mappers.getMapper(OrderHistoryMapper.class);

    public static OrderResponseDto of(OrderHistory orderHistory) {

        return new OrderResponseDto(orderHistory.getId(),
                UserResponseDto.of(orderHistory.getSeller()),
                orderHistory.getOrderDate(),
                orderHistory.getOrderStatus(),
                orderHistory.getReceiveStatus() != null ? orderHistory.getReceiveStatus() : false,
                mapper.toTemporaryBannerTypeResponseDtoList(orderHistory.getTemporaryBannerTypes())
                );
    }
}
