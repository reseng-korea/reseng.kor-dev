package com.resengkor.management.global.security.oauth.dto;

public interface OAuth2Response {
    public String getSocialProvider();
    public String getSocialId();
    public String getRepresentativeName();
    public String getEmail();
    public String getPhoneNumber();
}
