package com.resengkor.management.domain.user.service;


import com.resengkor.management.domain.user.repository.RegionRepository;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserProfileRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.domain.user.dto.UserDTO;
import com.resengkor.management.domain.user.dto.UserMapper;
import com.resengkor.management.domain.user.dto.UserRegisterRequest;
import com.resengkor.management.domain.user.entity.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final RegionRepository regionRepository;
    private final RoleHierarchyRepository roleHierarchyRepository;
//    private final BCryptPasswordEncoder passwordEncoder; //시큐리티

    private final UserMapper userMapper; // Mapper를 주입받음


    @Transactional
    public UserDTO changeUserRole(Long adminId, Long lowerUserId, Role newRole) {
        // 관리자 찾기 (관리자는 항상 ROLE_MANAGER)
        User adminUser = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("관리자를 찾을 수 없습니다."));

        // 하위 사용자 찾기
        User lowerUser = userRepository.findById(lowerUserId)
                .orElseThrow(() -> new RuntimeException("하위 사용자를 찾을 수 없습니다."));

        // 새로운 역할이 기존 역할보다 같은지 확인
        if (lowerUser.getRole().getRank() == newRole.getRank()) {
            throw new RuntimeException("새로운 역할이 기존 역할과 같습니다.");
        }

        // 새로운 역할이 기존보다 높은지 낮은지
        boolean isHigherRole = newRole.getRank() > lowerUser.getRole().getRank();
        if (lowerUser.getRole() == Role.ROLE_GUEST) {
            // Guest일 경우 상위 경로 복제
            log.info("GUEST유저 ROLE 변경 성공");
            roleHierarchyRepository.addNewPathsWithoutSelf(lowerUser.getId(), adminUser.getId(), newRole.getRole());
        }
        else{
            if (isHigherRole) {
                // 새로운 조상 찾기 (newAncestor)
                User newAncestor = findNewAncestorForRoleChange(lowerUser, newRole);
                // 1. lowerUser의 기존 경로 삭제 (lowerUser와 그 자식들의 기존 경로 삭제)
                roleHierarchyRepository.deleteByDescendant(lowerUser.getId());
                // 2. 새로운 조상과 경로 추가 (lowerUser와 그 자식들을 새로운 조상과 연결)
                roleHierarchyRepository.addNewPathsForChildrenWithoutSelf(lowerUser.getId(), newAncestor.getId());
            } else {//하락할 때
                //바로 아래 자식 뽑아놓음
                List<User> children = roleHierarchyRepository.findDirectChildrenByAncestor(lowerUser.getId());
                if (!children.isEmpty()) { //자식이 있어
                    //내 바로 위의 조상 찾아
                    User newAncestor = findNewAncestorForRoleChange(lowerUser, newRole);
                    log.info("새로운 조상 id = {}",newAncestor.getId());

                    for (User child : children) {
                        log.info("child id = {}",child.getId());
                        roleHierarchyRepository.deleteByDescendant(child.getId());
                        if (child.getRole().getRank() >= newRole.getRank()) {
                            //자식이 내 Role보다 높거나 같아
                            log.info("자식이 내 role보다 높거나 같아");
                            roleHierarchyRepository.addNewPathsForChildrenWithoutSelf(child.getId(), newAncestor.getId());
                        } else {
                            //다시 lowerUser랑 연결 시켜 (자식이 내 Role보다 낮아)
                            log.info("자식이 내 role보다 낮아");
                            roleHierarchyRepository.addNewPathsForChildrenWithoutSelf(child.getId(), lowerUser.getId());
                        }
                    }
                }
            }
        }

        // 역할만 업데이트 (자기 자신 경로는 유지하고 역할만 업데이트)
        roleHierarchyRepository.updateRole(lowerUser, newRole);
        log.info("role 계층 자신의 역할 업데이트");

        lowerUser = lowerUser.toBuilder().role(newRole).build();
        User updatedUser = userRepository.save(lowerUser);
        log.info("User에서 자신의 역할 업데이트");
        return userMapper.toUserDTO(updatedUser);
    }

    private User findNewAncestorForRoleChange(User lowerUser, Role newRole) {
        List<User> ancestors = roleHierarchyRepository.findAncestorsByDescendant(lowerUser);
        for(User ancestor : ancestors){
            log.info("조상 id {}, 조상 등급 {}, 조상 랭크 {}",ancestor.getId(),ancestor.getRole(),ancestor.getRole().getRank());
        }
        for (User ancestor : ancestors) {
            if (ancestor.getRole().getRank() > newRole.getRank()) {
                return ancestor;
            }
        }
        throw new RuntimeException("적절한 조상을 찾을 수 없습니다.");
    }
}