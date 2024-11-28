package com.resengkor.management.domain.user.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.resengkor.management.domain.user.dto.QUserListDTO;
import com.resengkor.management.domain.user.dto.UserListDTO;
import com.resengkor.management.domain.user.dto.UserListPaginationDTO;
import com.resengkor.management.domain.user.entity.QUser;
import com.resengkor.management.domain.user.entity.QUserProfile;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class UserCustomRepositoryImpl implements UserCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public UserCustomRepositoryImpl(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
    }

    QUser user = QUser.user;
    QUserProfile userProfile = QUserProfile.userProfile;

    @Override
    public Optional<User> findManagerUser() {

        User manager = jpaQueryFactory
                .selectFrom(user)
                .where(user.role.eq(Role.ROLE_MANAGER))
                .fetchFirst();

        return Optional.ofNullable(manager);
    }

    @Override
    public UserListPaginationDTO getAllUserByManager(Pageable pageable, String role, String status, LocalDateTime createdAt, List<Role> accessibleRoles, String companyName, String city, String district) {

        BooleanBuilder builder = new BooleanBuilder();

        if(role != null && !role.trim().isEmpty())
            builder.and(user.role.eq(Role.valueOf(role)));
        else
            builder.and(user.role.in(accessibleRoles));

        if(status != null && !status.trim().isEmpty())
            builder.and(user.status.eq(Boolean.parseBoolean(status)));

        if(createdAt != null)
            builder.and(user.createdAt.after(createdAt));

        if(companyName != null && !companyName.trim().isEmpty())
            builder.and(user.companyName.contains(companyName));

        if(city != null && !city.trim().isEmpty())
            builder.and(userProfile.city.regionName.eq(city.trim()))
                    .and(userProfile.city.regionType.trim().eq("city")); // exact match가 아닌 경우만 추가

        if(district != null && !district.trim().isEmpty())
            builder.and(userProfile.district.regionName.eq(district.trim()))
                    .and(userProfile.district.regionType.trim().eq("DISTRICT")); // exact match가 아닌 경우만 추가

        List<UserListDTO> resultList = jpaQueryFactory
                .select(new QUserListDTO(user))
                .from(user)
                .join(user.userProfile, userProfile) // Join User with UserProfile
                .where(builder)
                .offset(pageable.getOffset()) // 페이징 처리 (offset)
                .limit(pageable.getPageSize()) // 페이징 처리 (limit)
                .orderBy(user.id.asc()) // 정렬 기준
                .fetch();

        Long totalCount = Optional.ofNullable(
            jpaQueryFactory
                .select(user.count())
                .from(user)
                .where(builder)
                .fetchOne()
        ).orElse(0L);

//        int totalPage = (int) Math.ceil((double) totalCount / pageable.getPageSize());

        return UserListPaginationDTO.builder()
                .totalCount(totalCount.intValue())
                .userList(resultList)
                .build();
    }
}
