package com.resengkor.management.global.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class RedisUtil {
    private final StringRedisTemplate redisTemplate;

    // 값을 Redis에 저장
    public boolean setData(String key, String value, long timeout, TimeUnit unit) {
        try {
            redisTemplate.opsForValue().set(key, value, timeout, unit);
            return true;
        } catch (DataAccessException e) {
            log.error("Redis 연결 오류 (setData): {}", e.getMessage(), e);
            return false;
        }
    }

    // Redis에서 값을 가져오기
    public String getData(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (DataAccessException e) {
            log.error("Redis 연결 오류 (getData): {}", e.getMessage(), e);
            return null; // 캐싱 실패로 간주
        }
    }

    // Redis에서 값을 삭제
    public boolean deleteData(String key) {
        try {
            redisTemplate.delete(key);
            return true;
        } catch (DataAccessException e) {
            log.error("Redis 연결 오류 (deleteData): {}", e.getMessage(), e);
            return false;
        }
    }

    // Redis에서 값을 가지고 있는지 확인
    public boolean existData(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    // 키의 남은 TTL(만료 시간) 가져오기
    public Long getRemainingTTL(String key) {
        try {
            if (Boolean.FALSE.equals(redisTemplate.hasKey(key))) {
                log.warn("Redis 키가 존재하지 않습니다: {}", key);
                return -2L;
            }
            return redisTemplate.getExpire(key); // 초 단위로 반환
        } catch (DataAccessException e) {
            log.error("Redis 연결 오류 (getRemainingTTL): {}", e.getMessage(), e);
            return -1L; // 기본값 반환
        }
    }
}
