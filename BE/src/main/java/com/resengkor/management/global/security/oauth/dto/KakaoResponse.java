package com.resengkor.management.global.security.oauth.dto;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
public class KakaoResponse implements OAuth2Response{
    private final Map<String, Object> attribute;

    @Override
    public String getSocialProvider() {
        return "kakao";
    }

    @Override
    public String getSocialId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getName() {
        return (String) ((Map) attribute.get("kakao_account")).get("email");
    }

    @Override
    public String getEmail() {
        return (String) ((Map) attribute.get("properties")).get("nickname");
    }
}
