package com.resengkor.management.domain.banner.controller;

import com.resengkor.management.domain.banner.dto.*;
import com.resengkor.management.domain.banner.service.OrderService;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(description = "발주 요청 생성")
    @PostMapping
    public CommonResponse createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        return orderService.createOrder(orderRequestDto);
    }

    @Operation(description = "로그인한 사용자의 모든 발주 내역 조회")
    @GetMapping
    public DataResponse<List<OrderResponseDto>> getUserOrderHistories() {
        return orderService.getUserOrderHistories();
    }

    @Operation(description = "orderId로 발주 내역 조회")
    @GetMapping("/{orderId}")
    public DataResponse<OrderResponseDto> getOrderById(@PathVariable Long orderId) {
        return orderService.getUserOrderHistoryById(orderId);
    }

    @Operation(description = "수령 상태 업데이트")
    @PatchMapping("/{orderId}")
    public CommonResponse updateReceiveStatus(@PathVariable Long orderId, @RequestBody ReceiveStatusUpdateDto receiveStatusUpdateDto) {
        return orderService.updateReceiveStatus(orderId, receiveStatusUpdateDto.getReceiveStatus());
    }

    @Operation(description = "로그인한 사용자와 sellerId가 같은 발주내역 모두 조회")
    @GetMapping("/seller")
    public DataResponse<List<ReceivedOrderResponseDto>> getUserReceivedOrderHistories() {
        return orderService.getUserReceivedOrderHistories();
    }

    @Operation(description = "배송 상태 업데이트")
    @PatchMapping("/status/{orderId}")
    public CommonResponse updateOrderStatus(@PathVariable Long orderId, @RequestBody OrderStatusUpdateRequestDto orderStatusUpdateRequestDto) {
        return orderService.updateOrderStatus(orderId, orderStatusUpdateRequestDto.getOrderStatus());
    }
}
