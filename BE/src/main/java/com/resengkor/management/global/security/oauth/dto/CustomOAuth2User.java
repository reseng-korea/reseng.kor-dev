package com.resengkor.management.global.security.oauth.dto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {
    private final OAuth2UserDTO oAuth2UserDto;

    // 통일 x -> return null
    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return oAuth2UserDto.getRole();
            }
        });
        return collection;
    }

    @Override
    public String getName() {
        return oAuth2UserDto.getRepresentativeName();
    }

    public String getUsername(){
        //provider + provider id
        return oAuth2UserDto.getSocialProviderId();
    }
    public String getEmail(){
        return oAuth2UserDto.getEmail();
    }

    public Long getUserId() {
        return oAuth2UserDto.getUserId();
    }
}