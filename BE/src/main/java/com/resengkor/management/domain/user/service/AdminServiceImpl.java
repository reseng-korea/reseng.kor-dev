package com.resengkor.management.domain.user.service;

import com.resengkor.management.domain.user.dto.UserDTO;
import com.resengkor.management.domain.user.dto.UserListPaginationDTO;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.security.authorization.UserAuthorizationUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Getter
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AdminServiceImpl {

//    private final UserRepository userRepository;
//    private final RoleHierarchyRepository roleHierarchyRepository;

//    @Transactional
//    public DataResponse<UserListPaginationDTO> getAllUserByManager(int page, String role, String status, String createdDate) {
//
//        Long userId = UserAuthorizationUtil.getLoginMemberId();
//        User loginUser = userRepository.findById(userId)
//                .orElseThrow(() -> new CustomException(ExceptionStatus.MEMBER_NOT_FOUND));
//
//        if (loginUser.getRole() != Role.ROLE_MANAGER)
//            throw new CustomException(ExceptionStatus.FORBIDDEN_FAILED);
//
//        LocalDateTime createdAt = null;
//
//        if(createdDate != null && !createdDate.isEmpty())
//            createdAt = LocalDateTime.parse(createdDate);
//
//        PageRequest pageRequest = PageRequest.of(page, 10);
//
//        UserListPaginationDTO userListPaginationDTO = userRepository.getAllUserByManager(pageRequest, role, status, createdAt);
//
//        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), userListPaginationDTO);
//    }
}