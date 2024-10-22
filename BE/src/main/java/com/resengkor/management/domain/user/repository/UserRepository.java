package com.resengkor.management.domain.user.repository;



import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    Optional<User> findByRole(@Param("role") Role role);

    // 업체명과 휴대폰 번호로 User를 찾는 메서드
    Optional<User> findByCompanyNameAndPhoneNumber(String companyName, String phoneNumber);




}