package com.resengkor.management.domain.banner.service;

import com.resengkor.management.domain.banner.repository.BannerTypeRepository;
import com.resengkor.management.domain.user.repository.RoleHierarchyRepository;
import com.resengkor.management.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final RoleHierarchyRepository roleHierarchyRepository;
    private final BannerTypeRepository bannerTypeRepository;
    private final OrderHistoryRepository orderHistoryRepository;
}
