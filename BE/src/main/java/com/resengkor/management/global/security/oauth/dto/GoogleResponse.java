package com.resengkor.management.global.security.oauth.dto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class GoogleResponse implements OAuth2Response {
    private final Map<String, Object> attribute;

    @Override
    public String getSocialProvider() {
        return "google";
    }

    @Override
    public String getSocialProviderId() {
        return attribute.get("sub").toString();
    }

    @Override
    public String getName() {
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
