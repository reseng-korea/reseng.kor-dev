package com.resengkor.management.domain.user.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.resengkor.management.domain.user.dto.UserListDTO;
import com.resengkor.management.domain.user.dto.UserListPaginationDTO;
import com.resengkor.management.domain.user.entity.QUser;
import com.resengkor.management.domain.user.entity.Role;
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

    @Override
    public UserListPaginationDTO getAllUserByManager(Pageable pageable, String role, String status, LocalDateTime createdAt, List<Role> accessibleRoles) {

        BooleanBuilder builder = new BooleanBuilder();

        if(role != null)
            builder.and(user.role.eq(Role.valueOf(role)));
        else
            builder.and(user.role.in(accessibleRoles));

        if(status != null)
            builder.and(user.status.eq(Boolean.parseBoolean(status)));

        if(createdAt != null)
            builder.and(user.createdAt.after(createdAt));

        List<UserListDTO> resultList = jpaQueryFactory.selectFrom(user)
                .where(builder)
                .offset(pageable.getOffset())     // 페이징 처리 (offset)
                .limit(pageable.getPageSize())    // 페이징 처리 (limit)
                .orderBy(user.id.asc())   // 정렬 기준
                .fetch()
                .stream()
                .map(UserListDTO::new)
                .toList();

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
