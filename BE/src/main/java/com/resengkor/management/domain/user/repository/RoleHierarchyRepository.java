package com.resengkor.management.domain.user.repository;


import com.resengkor.management.domain.user.entity.RoleHierarchy;
import com.resengkor.management.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleHierarchyRepository extends JpaRepository<RoleHierarchy, Long> {

    Optional<RoleHierarchy> findByAncestorAndDescendant(User ancester, User descendant);
}