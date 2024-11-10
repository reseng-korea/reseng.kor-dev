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
    public String getRepresentativeName() {
        return (String) ((Map) attribute.get("properties")).get("nickname");
    }

    @Override
    public String getEmail() {
        return (String) ((Map) attribute.get("kakao_account")).get("email");
    }

    //사업자로 바뀌면 PhoneNumber 메소드
    @Override
    public String getPhoneNumber() {
        return "";
    }
    //사업자로 바뀌면 nickname이 아니라 실제 이름으로 받기
//    @Override
//    public String getName() {
//        return (String) ((Map) attribute.get("properties")).get("nickname");
//    }
}
