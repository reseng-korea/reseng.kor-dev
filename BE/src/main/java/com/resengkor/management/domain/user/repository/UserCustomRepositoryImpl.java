package com.resengkor.management.domain.user.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.resengkor.management.domain.user.dto.QUserListDTO;
import com.resengkor.management.domain.user.dto.UserListDTO;
import com.resengkor.management.domain.user.dto.UserListPaginationDTO;
import com.resengkor.management.domain.user.entity.*;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public class UserCustomRepositoryImpl implements UserCustomRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public UserCustomRepositoryImpl(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
    }

    QUser user = QUser.user;
    QUserProfile userProfile = QUserProfile.userProfile;
    QRoleHierarchy roleHierarchy = QRoleHierarchy.roleHierarchy;

    @Override
    public Optional<User> findManagerUser() {

        User manager = jpaQueryFactory
                .selectFrom(user)
                .where(user.role.eq(Role.ROLE_MANAGER))
                .fetchFirst();

        return Optional.ofNullable(manager);
    }

    @Override
    public UserListPaginationDTO getAllUserByManager(Pageable pageable, Long loginUserId, String role, String status, LocalDateTime createdAt, List<Role> accessibleRoles, String companyName, String city, String district) {

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

        // **자기 자신 제외 조건 추가**
        builder.and(user.id.ne(loginUserId)); // loginUserId와 같은 ID를 가진 유저 제외

        // 조회된 유저 리스트 가져오기
        List<User> userList = jpaQueryFactory
                .selectFrom(user)
                .join(user.userProfile, userProfile)
                .where(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // RoleHierarchy에서 부모-자식 관계 조회
        List<Long> userIdList = userList.stream().map(User::getId).toList();

        Set<Long> managedUserIdList = new HashSet<>(jpaQueryFactory
                .select(roleHierarchy.descendant.id)
                .from(roleHierarchy)
                .where(roleHierarchy.ancestor.id.eq(loginUserId)
                        .and(roleHierarchy.descendant.id.in(userIdList))
                )
                .fetch());

        // UserListDTO 생성
        List<UserListDTO> resultList = userList.stream()
                .map(user -> UserListDTO.fromUser(
                        user,
                        managedUserIdList.contains(user.getId()) // 부모-자식 관계 여부 판단
                ))
                .collect(Collectors.toList());

        // 결과 정렬: managementStatus(true 먼저), Role 우선순위
        resultList.sort((u1, u2) -> {
            // 관리 상태 기준 정렬 (true 먼저)
            if (u1.isManagementStatus() && !u2.isManagementStatus()) return -1;
            if (!u1.isManagementStatus() && u2.isManagementStatus()) return 1;

            // Role 우선순위 기준 정렬
            int roleOrder1 = getRoleRank(u1.getRole());
            int roleOrder2 = getRoleRank(u2.getRole());

            return Integer.compare(roleOrder1, roleOrder2);
        });

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

    // 역할 우선순위(rank)를 반환하는 메서드
    private int getRoleRank(Role role) {
        return role.getRank(); // Role의 rank 값을 그대로 사용
    }
}
