package com.resengkor.management.domain.order.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
@Getter
public enum OrderStatus {

    UNCONFIRMED("미확인"),
    CONFIRMED("확인완료"),
    SHIPPED_COURIER("출고완료(택배)"),
    SHIPPED_FREIGHT("출고완료(화물)");

    private final String description;
    private List<OrderStatus> allowedNextStatuses;

    // 초기화 블록에서 상태 전이 정의
    static {
        UNCONFIRMED.allowedNextStatuses = List.of(CONFIRMED);
        CONFIRMED.allowedNextStatuses = List.of(SHIPPED_COURIER, SHIPPED_FREIGHT);
        SHIPPED_COURIER.allowedNextStatuses = List.of();
        SHIPPED_FREIGHT.allowedNextStatuses = List.of();
    }

    public boolean canTransitionTo(OrderStatus nextStatus) {
        return allowedNextStatuses.contains(nextStatus);
    }
}
