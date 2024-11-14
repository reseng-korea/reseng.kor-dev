package com.resengkor.management.global.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.Cursor;

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
        } catch (Exception e) {
            log.error("Redis 오류 (setData): {}", e.getMessage(), e);
            return false;
        }
    }

    // Redis에서 값을 가져오기
    public String getData(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.error("Redis 오류 (getData): {}", e.getMessage(), e);
            return null; // 캐싱 실패로 간주
        }
    }

    // Redis에서 값을 삭제
    public boolean deleteData(String key) {
        try {
            redisTemplate.delete(key);
            return true;
        } catch (Exception e) {
            log.error("Redis 오류 (deleteData): {}", e.getMessage(), e);
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
        } catch (Exception e) {
            log.error("Redis 오류 (getRemainingTTL): {}", e.getMessage(), e);
            return -1L; // 기본값 반환
        }
    }

    //해당 유저의 모든 기기 refresh 토큰 삭제
    public boolean deleteAllRefreshTokensByEmailUsingScan(String email) {
        try {
            String pattern = "refresh_token:" + email + ":*";
            Cursor<byte[]> cursor = redisTemplate.getConnectionFactory().getConnection()
                    .scan(ScanOptions.scanOptions().match(pattern).count(100).build());

            while (cursor.hasNext()) {
                redisTemplate.delete(new String(cursor.next()));
            }
            return true;  // 성공적으로 삭제된 경우 true 반환
        } catch (Exception e) {
            // 예외가 발생한 경우 false 반환
            log.error("Redis 오류 (deleteAll): {}", e.getMessage(), e);
            return false;
        }
    }
}
