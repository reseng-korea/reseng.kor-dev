    package com.resengkor.management.domain.banner.mapper;

    import com.resengkor.management.domain.banner.dto.OrderResponseDto;
    import com.resengkor.management.domain.banner.dto.TemporaryBannerTypeResponseDto;
    import com.resengkor.management.domain.banner.entity.OrderHistory;
    import com.resengkor.management.domain.banner.entity.TemporaryBannerType;
    import com.resengkor.management.domain.user.dto.response.UserResponseDto;
    import com.resengkor.management.domain.user.entity.User;
    import org.mapstruct.Mapper;
    import org.mapstruct.Mapping;
    import org.mapstruct.factory.Mappers;

    import java.util.List;
    import java.util.stream.Collectors;

    @Mapper(componentModel = "spring")
    public interface OrderHistoryMapper {

        // Mapper 인스턴스 (기본적인 방식, Spring을 통해 주입받으므로 사용하지 않아도 됨)
        BannerRequestMapper INSTANCE = Mappers.getMapper(BannerRequestMapper.class);

        // 단일 OrderHistory -> OrderResponseDto 변환
        @Mapping(source = "seller", target = "userResponseDto")
        @Mapping(source = "temporaryBannerTypes", target = "temporaryBannerTypeResponseDtoList")
        OrderResponseDto toDto(OrderHistory orderHistory);

        // User -> UserResponseDto 변환 메서드 추가
        UserResponseDto toUserResponseDto(User user);

        // TemporaryBannerType -> TemporaryBannerTypeResponseDto 변환 메서드
        @Mapping(source = "temporaryTypeWidth", target = "temporaryTypeWidth")
        @Mapping(source = "quantity", target = "quantity")
        TemporaryBannerTypeResponseDto toTemporaryBannerTypeResponseDto(TemporaryBannerType temporaryBannerType);


        // List<TemporaryBannerType> -> List<TemporaryBannerTypeResponseDto> 변환 메서드
        default List<TemporaryBannerTypeResponseDto> toTemporaryBannerTypeResponseDtoList(List<TemporaryBannerType> temporaryBannerTypes) {
            if (temporaryBannerTypes == null) {
                return null;
            }
            return temporaryBannerTypes.stream()
                    .map(this::toTemporaryBannerTypeResponseDto)
                    .collect(Collectors.toList());
        }

        // OrderHistory 리스트 -> OrderResponseDto 리스트 변환
        default List<OrderResponseDto> toDtoList(List<OrderHistory> orderHistories) {
            return orderHistories.stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
        }
    }
