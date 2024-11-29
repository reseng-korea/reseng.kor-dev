package com.resengkor.management.domain.user.controller;

import com.resengkor.management.domain.user.entity.RoleHierarchy;
import com.resengkor.management.domain.user.service.RoleHierarchyService;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
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

    @Operation(description = "부모-자식 관계 제거")
    @DeleteMapping("/{childId}")
    public CommonResponse deleteRoleHierarchy(@Valid @PathVariable("childId") Long childId) {

        return roleHierarchyService.deleteRoleHierarchy(childId);
    }

    @Operation(description = "로그인 유저가 부모인 관계 출력")
    @GetMapping("/ancestor")
    public DataResponse<?> getRoleHierarchyByAncestor() {

        return roleHierarchyService.getRoleHierarchyByAncestor();
    }

    @Operation(description = "로그인 유저가 자식인 관계 출력")
    @GetMapping("/descendant")
    public DataResponse<?> getRoleHierarchyByDescendant() {

        return roleHierarchyService.getRoleHierarchyByDescendant();
    }

    @Operation(description = "Guest 유저 Customer로 승격")
    @PutMapping("/guest/to/customer/{childId}")
    public CommonResponse makeGuestToCustomer(@Valid @PathVariable("childId") Long childId) {

        return roleHierarchyService.makeGuestToCustomer(childId);
    }
}
