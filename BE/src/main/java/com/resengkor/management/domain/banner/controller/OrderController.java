package com.resengkor.management.domain.banner.controller;

import com.resengkor.management.domain.banner.dto.*;
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
        return ResponseEntity.ok("Order - receiveStatus updated successfully");
    }

    // 로그인한 사용자와 sellerId가 같은 발주내역 모두 조회
    @GetMapping("/seller")
    public ResponseEntity<List<ReceivedOrderResponseDto>> getUserReceivedOrderHistories() {
        List<ReceivedOrderResponseDto> sellerOrders = orderService.getUserReceivedOrderHistories();
        return ResponseEntity.ok(sellerOrders);
    }

    // 배송 상태 업데이트 엔드포인트
    @PatchMapping("/status/{orderId}")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @RequestBody OrderStatusUpdateRequestDto orderStatusUpdateRequestDto) {
        orderService.updateOrderStatus(orderId, orderStatusUpdateRequestDto.getOrderStatus());
        return ResponseEntity.ok("Order - orderStatus updated successfully");
    }
}
