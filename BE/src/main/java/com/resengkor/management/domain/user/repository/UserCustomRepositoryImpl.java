package com.resengkor.management.domain.user.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.resengkor.management.domain.user.dto.UserListDTO;
import com.resengkor.management.domain.user.dto.UserListPaginationDTO;
import com.resengkor.management.domain.user.entity.*;
import org.springframework.data.domain.Pageable;

import java.util.*;
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
    public UserListPaginationDTO getAllUserByManager(Pageable pageable, Long loginUserId, String role, List<Role> accessibleRoles, String companyName, String city, String district, String manage) {

        BooleanBuilder builder = new BooleanBuilder();

        // accessibleRoles에 포함된 역할만 포함되도록 필터링
        builder.and(user.role.in(accessibleRoles));

        if(companyName != null && !companyName.trim().isEmpty())
            builder.and(user.companyName.contains(companyName));

        if(city != null && !city.trim().isEmpty())
            builder.and(userProfile.city.regionName.eq(city.trim()))
                    .and(userProfile.city.regionType.trim().eq("city")); // exact match가 아닌 경우만 추가

        if(district != null && !district.trim().isEmpty())
            builder.and(userProfile.district.regionName.eq(district.trim()))
                    .and(userProfile.district.regionType.trim().eq("DISTRICT")); // exact match가 아닌 경우만 추가

        // Scope 조건에 따른 필터링 추가
        if (role != null && !role.trim().isEmpty()) {
            if ("ALL".equals(role)) {
                // ALL은 모든 역할을 포함하므로 별도의 추가 조건이 필요 없음
            } else {
                // Scope 값이 유효하면 해당 역할 이상인 사용자만 필터링
//                Role targetRole = Role.valueOf(role);
//                builder.and(user.role.in(getRolesUpTo(targetRole)));

                // 입력받은 Role만 출력하기 위해
                builder.and(user.role.eq(Role.valueOf(role)));
            }
        }

        // 회원 상태가 true인 사용자만 포함되도록 조건 추가
        builder.and(user.status.eq(true)); // 상태가 활성화(true)인 사용자만 조회

        // **자기 자신 제외 조건 추가**
        builder.and(user.id.ne(loginUserId)); // loginUserId와 같은 ID를 가진 유저 제외

        // 조회된 유저 리스트 가져오기
        List<User> userList = jpaQueryFactory
                .selectFrom(user)
                .join(user.userProfile, userProfile)
                .where(builder)
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

        // manage 필터링 적용: 관리 상태(true/false)로 결과 필터링
        if ("MANAGE".equals(manage)) {
            resultList = resultList.stream()
                    .filter(UserListDTO::isManagementStatus)
                    .collect(Collectors.toList());
        } else if ("NONMANAGE".equals(manage)) {
            resultList = resultList.stream()
                    .filter(dto -> !dto.isManagementStatus())
                    .collect(Collectors.toList());
        }

        // 결과 정렬: managementStatus(true 먼저), Role 우선순위
        resultList.sort((u1, u2) -> {
            // 관리 상태 기준 정렬 (true 먼저)
            if (u1.isManagementStatus() && !u2.isManagementStatus())
                return -1;
            if (!u1.isManagementStatus() && u2.isManagementStatus())
                return 1;

            // Role 우선순위 기준 정렬
            int roleOrder1 = getRoleRank(u1.getRole());
            int roleOrder2 = getRoleRank(u2.getRole());

            return Integer.compare(roleOrder2, roleOrder1);
        });

        // 페이지네이션 적용
        int totalCount = resultList.size(); // 전체 데이터 개수
        int fromIndex = Math.min((int) pageable.getOffset(), totalCount);
        int toIndex = Math.min((fromIndex + pageable.getPageSize()), totalCount);
        List<UserListDTO> pagedList = resultList.subList(fromIndex, toIndex);

        return UserListPaginationDTO.builder()
                .totalCount(totalCount)
                .userList(pagedList)
                .build();
    }

    // 역할 우선순위(rank)를 반환하는 메서드
    private int getRoleRank(Role role) {
        return role.getRank(); // Role의 rank 값을 그대로 사용
    }

    // 특정 역할 이상인 사용자들만 가져오는 메서드
    private List<Role> getRolesUpTo(Role targetRole) {
        List<Role> roles = new ArrayList<>();
        for (Role role : Role.values()) {
            if (role.getRank() <= targetRole.getRank()) {
                roles.add(role);
            }
        }
        return roles;
    }
}
