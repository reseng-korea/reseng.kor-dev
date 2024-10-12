package com.resengkor.management.global.security.jwt.service;

import com.resengkor.management.global.security.jwt.entity.RefreshToken;
import com.resengkor.management.global.security.jwt.repository.RefreshRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshRepository refreshRepository;

    @Transactional
    public void saveRefresh(String email, Integer expireS, String refresh) {
        RefreshToken refreshToken = RefreshToken.builder()
                .email(email)
                .refresh(refresh)
                .expiration(new Date(System.currentTimeMillis() + expireS * 1000L).toString())
                .build();

        refreshRepository.save(refreshToken);
    }
}
