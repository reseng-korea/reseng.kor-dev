package com.resengkor.management.global.security.oauth.dto;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
public class GoogleResponse implements OAuth2Response {
    private final Map<String, Object> attribute;

    @Override
    public String getSocialProvider() {
        return "google";
    }

    @Override
    public String getSocialId() {
        return attribute.get("sub").toString();
    }

    @Override
    public String getRepresentativeName() {
        return attribute.get("name").toString();
    }

    @Override
    public String getEmail() {
        return attribute.get("email").toString();
    }

    @Override
    public String getPhoneNumber() {
        return null;
    }
}
