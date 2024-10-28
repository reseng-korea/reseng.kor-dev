package com.resengkor.management.global.util;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RedisUtil {
    private final StringRedisTemplate redisTemplate;

    // 값을 Redis에 저장
    public void setData(String key, String value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    // Redis에서 값을 가져오기
    public String getData(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    // Redis에서 값을 삭제
    public void deleteData(String key) {
        redisTemplate.delete(key);
    }

    // Redis에서 값을 가지고 있는지
    public boolean existData(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
