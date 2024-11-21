package com.resengkor.management.domain.order.dto;

import com.resengkor.management.domain.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusUpdateRequestDto {

    private OrderStatus orderStatus;
}
