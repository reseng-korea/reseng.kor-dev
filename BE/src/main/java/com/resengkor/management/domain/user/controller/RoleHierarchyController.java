package com.resengkor.management.domain.user.controller;

import com.resengkor.management.domain.user.service.RoleHierarchyService;
import com.resengkor.management.global.response.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/role/hierarchy")
@RequiredArgsConstructor
@Slf4j
public class RoleHierarchyController {

    private final RoleHierarchyService roleHierarchyService;

    @Operation(description = "부모-자식 관계 추가")
    @PostMapping("/{childId}")
    public CommonResponse addRoleHierarchy(@Valid @PathVariable("childId") Long childId) {

        return roleHierarchyService.addRoleHierarchy(childId);
    }
}
