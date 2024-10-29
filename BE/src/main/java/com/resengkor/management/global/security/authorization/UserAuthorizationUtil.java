package com.resengkor.management.global.security.authorization;

import com.resengkor.management.global.security.jwt.dto.CustomUserDetails;
import com.resengkor.management.global.security.oauth.dto.CustomOAuth2User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
public class UserAuthorizationUtil {

    private UserAuthorizationUtil() {
        throw new AssertionError();
    }
    public static Long getLoginMemberId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof CustomUserDetails) {
                CustomUserDetails userDetails = (CustomUserDetails) principal;
                log.info("userDetails.getUsername() = {}", userDetails.getUsername());
                log.info("userDetails.getUserId() = {}",userDetails.getUserId());
                return userDetails.getUserId();
            } else if (principal instanceof CustomOAuth2User) {
                CustomOAuth2User oauthUser = (CustomOAuth2User) principal;
                log.info("oauthUser.getUserId() = {}",oauthUser.getUserId());
                return oauthUser.getUserId();
            }
        }

        throw new IllegalStateException("User is not authenticated or no member ID found");
    }
}
