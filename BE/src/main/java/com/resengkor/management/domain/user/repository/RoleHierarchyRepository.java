package com.resengkor.management.domain.user.repository;


import com.resengkor.management.domain.user.entity.RoleHierarchy;
import com.resengkor.management.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleHierarchyRepository extends JpaRepository<RoleHierarchy, Long> {

    // 부모 등급 사용자 조회 (하나만 반환)
    @Query("SELECT rh.ancestor FROM RoleHierarchy rh WHERE rh.descendant.id = :userId")
    Optional<User> findAncestorRole(@Param("userId") Long userId);

    // 자식 등급 사용자 조회 (여러 명 가능)
    @Query("SELECT rh.descendant FROM RoleHierarchy rh WHERE rh.ancestor.id = :userId")
    List<User> findDescendantRoles(@Param("userId") Long userId);

}