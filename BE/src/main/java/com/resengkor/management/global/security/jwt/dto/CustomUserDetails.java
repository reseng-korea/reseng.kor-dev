package com.resengkor.management.global.security.jwt.dto;

import com.resengkor.management.domain.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {
    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return user.getRole().getRole();
            }
        });

        return collection;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    //계정 만료 여부
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //계정 잠김 여부
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //비밀번호 만료 여부
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //사용자 활성화 여부
    @Override
    public boolean isEnabled() {
        return user.isStatus();
    }

    public Long getUserId() {
        return user.getId();
    }

    public boolean isEmailStatus() {
        return user.isEmailStatus();
    }

    public boolean isTemporaryPasswordStatus() {
        return user.isTemporaryPasswordStatus();
    }

    public String getCompanyName() {
        return user.getCompanyName();
    }

    public String getRepresentativeName() {
        return user.getRepresentativeName();
    }

    public String getPhoneNumber() {
        return user.getPhoneNumber();
    }

    public boolean isPhoneNumberStatus() {
        return user.isPhoneNumberStatus();
    }

    public String getLoginType() {
        return user.getLoginType().toString();
    }








}
