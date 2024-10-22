package com.resengkor.management.domain.user.repository;


import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    // User를 통해 UserProfile을 찾는 메서드
    Optional<UserProfile> findByUser(User user);
}
