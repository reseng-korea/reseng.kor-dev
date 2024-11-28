package com.resengkor.management.domain.user.repository;

import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>,
        UserCustomRepository, QuerydslPredicateExecutor<User> {


    Optional<User> findByEmail(String email);

    // 업체명과 휴대폰 번호로 User를 찾는 메서드
    Optional<User> findByCompanyNameAndPhoneNumber(String companyName, String phoneNumber);

    // phoneNumber로 사용자 조회
    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumber(String phoneNumber);

    // 이메일과 전화번호가 모두 일치하는 사용자 찾기
    Optional<User> findByEmailAndPhoneNumber(String email, String phoneNumber);

//    @Query("SELECT u FROM User u " +
//            "JOIN FETCH u.userProfile up " +
//            "JOIN FETCH up.city " + // city와 district를 명확히 지정
//            "JOIN FETCH up.district " +
//            "WHERE u.id = :userId")
//    Optional<User> findUserWithProfileAndRegionById(@Param("userId") Long userId);
//
//    @Query("SELECT u FROM User u " +
//            "JOIN FETCH u.userProfile up " +
//            "LEFT JOIN FETCH up.city " +
//            "LEFT JOIN FETCH up.district " +
//            "WHERE u.role IN (:roles)")
//    Page<User> findAllWithProfileAndRegion(@Param("roles") List<Role> roles, Pageable pageable);

    List<User> findByRole(Role role);
}