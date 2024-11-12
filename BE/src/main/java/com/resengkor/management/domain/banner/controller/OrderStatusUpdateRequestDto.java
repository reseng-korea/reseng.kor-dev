package com.resengkor.management.domain.banner.controller;

import com.resengkor.management.domain.banner.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusUpdateRequestDto {

    private OrderStatus orderStatus;
}
