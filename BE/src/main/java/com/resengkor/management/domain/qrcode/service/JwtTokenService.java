package com.resengkor.management.domain.qrcode.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JwtTokenService {

    private final RedisTemplate<String, String> redisTemplate;

    @Autowired
    public JwtTokenService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Redis에서 저장된 토큰을 가져옴
    public Optional<String> getToken(String username) {
        String token = redisTemplate.opsForValue().get(username);
        return Optional.ofNullable(token);
    }
}
