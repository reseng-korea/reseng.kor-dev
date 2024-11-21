package com.resengkor.management.domain.order.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum OrderStatus {

    UNCONFIRMED("미확인"),
    CONFIRMED("확인완료"),
    SHIPPED_COURIER("출고완료(택배)"),
    SHIPPED_FREIGHT("출고완료(화물)");

    private final String description;
}
