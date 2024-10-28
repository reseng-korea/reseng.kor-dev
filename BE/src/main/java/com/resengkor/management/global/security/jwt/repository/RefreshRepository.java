package com.resengkor.management.global.security.jwt.repository;

import com.resengkor.management.global.security.jwt.entity.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshRepository extends JpaRepository<RefreshToken, Long> {
    //pk인 email로 찾기
    List<RefreshToken> findByEmail(String Email);

    //refresh토큰이 존재하는지
    Boolean existsByRefresh(String refresh);

    //refresh토큰 지우기
    @Transactional
    void deleteByRefresh(String refresh);

    // email로 해당하는 refresh 토큰 삭제
    @Transactional
    void deleteByEmail(String email); // 추가된 메서드

    Optional<RefreshToken> findByRefresh(String refresh);
}
