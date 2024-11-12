package com.resengkor.management.global.security.jwt.service;

import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.global.security.jwt.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("------------------------------------------------");
        log.info("enter loadUserByUsername method");
        log.info("------------------------------------------------");
        // 사용자 존재 여부 확인 및 UserDetails 반환
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        log.info("------------------------------------------------");
        log.info("DB에 있는 user 잘 찾아옴");
        log.info("------------------------------------------------");
        return new CustomUserDetails(user);
    }
}
