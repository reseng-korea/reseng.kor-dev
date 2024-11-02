package com.resengkor.management.domain.user.repository;

import com.resengkor.management.domain.user.dto.UserListPaginationDTO;
import com.resengkor.management.domain.user.entity.Role;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface UserCustomRepository {

    UserListPaginationDTO getAllUserByManager(Pageable pageable, String role, String status, LocalDateTime createdDate, List<Role> accessibleRoles);
}
