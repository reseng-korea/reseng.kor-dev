package com.resengkor.management.domain.user.repository;

import com.resengkor.management.domain.user.dto.UserListPaginationDTO;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserCustomRepository {

    // Manager (관리자) 찾기
    Optional<User> findManagerUser();

    UserListPaginationDTO getAllUserByManager(Pageable pageable, Long loginUserId, String role, String status, LocalDateTime createdDate, List<Role> accessibleRoles, String companyName, String city, String district);
}
