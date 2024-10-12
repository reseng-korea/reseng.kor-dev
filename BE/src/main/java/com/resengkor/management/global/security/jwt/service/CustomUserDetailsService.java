package com.resengkor.management.global.security.jwt.service;

import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.global.security.jwt.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return new CustomUserDetails(user);
        }
        throw new UsernameNotFoundException("User not found");
    }
}
