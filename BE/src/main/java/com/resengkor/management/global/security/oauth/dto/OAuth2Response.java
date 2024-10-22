package com.resengkor.management.global.security.oauth.dto;

public interface OAuth2Response {
    public String getSocialProvider();
    public String getSocialId();
    public String getName();
    public String getEmail();
}
