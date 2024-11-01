package com.resengkor.management.domain.user.repository;

import com.resengkor.management.domain.user.dto.UserListPaginationDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface UserCustomRepository {

    UserListPaginationDTO getAllUserByManager(Pageable pageable, String role, String status, LocalDateTime createdDate);
}
