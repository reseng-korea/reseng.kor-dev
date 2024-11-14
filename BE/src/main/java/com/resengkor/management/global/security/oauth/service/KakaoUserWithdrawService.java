package com.resengkor.management.global.security.oauth.service;

import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class KakaoUserWithdrawService {
    @Value("${spring.kakao.api.url}")
    private String kakaoUnlinkUrl;

    @Value("${spring.kakao.api.admin-key}")
    private String adminKey;

    public void unlinkKakaoUser(String userId) {
        log.info("------Service Start : 카카오 탈퇴하기---------");
        RestTemplate restTemplate = new RestTemplate();

        // HTTP Headers 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "KakaoAK " + adminKey);

        // Body 설정
        String body = "target_id_type=user_id&target_id=" + userId;

        // HTTP 요청 생성
        HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);

        try {
            // API 요청 보내기
            ResponseEntity<String> response = restTemplate.postForEntity(kakaoUnlinkUrl, requestEntity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("회원 탈퇴 성공");
            } else {
                log.info("회원 탈퇴 실패: " + response.getBody());
            }
        } catch (HttpClientErrorException e) {
            // API 호출 실패 시 예외 처리
            log.info("카카오 API 호출 중 에러 발생: " + e.getMessage());
            throw new RuntimeException("카카오 API 에러", e);
        }
    }
}
