package com.resengkor.management.domain.banner.controller;

import com.resengkor.management.domain.banner.dto.OrderRequestDto;
import com.resengkor.management.domain.banner.dto.OrderResponseDto;
import com.resengkor.management.domain.banner.dto.ReceiveStatusUpdateDto;
import com.resengkor.management.domain.banner.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 발주 요청 생성 엔드포인트
    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        orderService.createOrder(orderRequestDto);
        return ResponseEntity.ok("Order created successfully");
    }

    // 로그인한 사용자의 모든 발주 내역 조회 엔드포인트
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getUserOrderHistories() {
        List<OrderResponseDto> userOrders = orderService.getUserOrderHistories();
        return ResponseEntity.ok(userOrders);
    }

    // 특정 orderId로 발주 내역 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrderById(@PathVariable Long orderId) {
        OrderResponseDto responseDto = orderService.getUserOrderHistoryById(orderId);
        return ResponseEntity.ok(responseDto);
    }

    // 수령 상태 업데이트 엔드포인트
    @PatchMapping("/{orderId}")
    public ResponseEntity<String> updateReceiveStatus(@PathVariable Long orderId, @RequestBody ReceiveStatusUpdateDto receiveStatusUpdateDto) {
        orderService.updateReceiveStatus(orderId, receiveStatusUpdateDto.getReceiveStatus());
        return ResponseEntity.ok("Order receive status updated successfully");
    }
}
