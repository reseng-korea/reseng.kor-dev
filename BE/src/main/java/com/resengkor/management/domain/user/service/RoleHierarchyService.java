package com.resengkor.management.domain.user.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Getter
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class RoleHierarchyService {
}
