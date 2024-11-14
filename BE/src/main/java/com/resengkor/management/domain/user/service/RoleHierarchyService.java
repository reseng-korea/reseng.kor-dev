package com.resengkor.management.domain.user.service;

import com.resengkor.management.domain.user.dto.response.RoleHierarchyResponseDTO;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.RoleHierarchy;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Getter
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class RoleHierarchyService {

    private final UserRepository userRepository;
    private final RoleHierarchyRepository roleHierarchyRepository;

    private final UserService userService;

    @Transactional
    public CommonResponse addRoleHierarchy(Long childId) {
        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        User childUser = userRepository.findById(childId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        if(loginUser.getRole().getRank() <= childUser.getRole().getRank())
            throw new CustomException(ExceptionStatus.ROLE_PERMISSION_DENIED);

        List<Role> accessibleRoles = userService.getAccessibleRoles(loginUser.getRole());

        if (!accessibleRoles.contains(childUser.getRole()))
            throw new CustomException(ExceptionStatus.ROLE_CHANGE_FAIL);

        RoleHierarchy roleHierarchy = RoleHierarchy.builder()
                .ancestor(loginUser)
                .descendant(childUser)
                .depth(loginUser.getRole().getRank() - childUser.getRole().getRank())
                .build();

        roleHierarchyRepository.save(roleHierarchy);

        return new CommonResponse(ResponseStatus.CREATED_SUCCESS.getCode(), ResponseStatus.CREATED_SUCCESS.getMessage());
    }

    @Transactional
    public CommonResponse deleteRoleHierarchy(Long childId) {

        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        User childUser = userRepository.findById(childId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        if(loginUser.getRole().getRank() <= childUser.getRole().getRank())
            throw new CustomException(ExceptionStatus.ROLE_PERMISSION_DENIED);

        List<Role> accessibleRoles = userService.getAccessibleRoles(loginUser.getRole());

        if (!accessibleRoles.contains(childUser.getRole()))
            throw new CustomException(ExceptionStatus.ROLE_CHANGE_FAIL);

        RoleHierarchy roleHierarchy = roleHierarchyRepository.findByAncestorAndDescendant(loginUser, childUser)
                .orElseThrow(() -> new CustomException(ExceptionStatus.HIERARCHY_NOT_FOUND));

        roleHierarchyRepository.delete(roleHierarchy);

        return new CommonResponse(ResponseStatus.DELETED_SUCCESS.getCode(), ResponseStatus.DELETED_SUCCESS.getMessage());
    }

    public DataResponse<List<RoleHierarchyResponseDTO>> getRoleHierarchyByAncestor() {

        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        List<RoleHierarchy> list = roleHierarchyRepository.findByAncestor(loginUser);

        List<RoleHierarchyResponseDTO> responseList = list.stream()
                .map(roleHierarchy -> RoleHierarchyResponseDTO.builder()
                        .id(roleHierarchy.getId())
                        .ancestorId(roleHierarchy.getAncestor().getId())
                        .descendantId(roleHierarchy.getDescendant().getId())
                        .ancestorCompanyName(roleHierarchy.getAncestor().getCompanyName())
                        .ancestorRepresentativeName(roleHierarchy.getAncestor().getRepresentativeName())
                        .descendantCompanyName(roleHierarchy.getDescendant().getCompanyName())
                        .descendantRepresentativeName(roleHierarchy.getDescendant().getRepresentativeName())
                        .build())
                .toList();

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), responseList);
    }

    public DataResponse<List<RoleHierarchyResponseDTO>> getRoleHierarchyByDescendant() {

        Long userId = UserAuthorizationUtil.getLoginMemberId();
        User loginUser = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));

        List<RoleHierarchy> list = roleHierarchyRepository.findByDescendant(loginUser);

        List<RoleHierarchyResponseDTO> responseList = list.stream()
                .map(roleHierarchy -> RoleHierarchyResponseDTO.builder()
                        .id(roleHierarchy.getId())
                        .ancestorId(roleHierarchy.getAncestor().getId())
                        .descendantId(roleHierarchy.getDescendant().getId())
                        .ancestorCompanyName(roleHierarchy.getAncestor().getCompanyName())
                        .ancestorRepresentativeName(roleHierarchy.getAncestor().getRepresentativeName())
                        .descendantCompanyName(roleHierarchy.getDescendant().getCompanyName())
                        .descendantRepresentativeName(roleHierarchy.getDescendant().getRepresentativeName())
                        .build())
                .toList();

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), responseList);
    }
}
