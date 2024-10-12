package com.resengkor.management.global.security.jwt.repository;

import com.resengkor.management.global.security.jwt.entity.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RefreshRepository extends JpaRepository<RefreshToken, Long> {
    //pk인 email로 찾기
    List<RefreshToken> findByEmail(String Email);

    //refresh토큰이 존재하는지
    Boolean existsByRefresh(String refresh);

    //refresh토큰 지우기
    @Transactional
    void deleteByRefresh(String refresh);
}
