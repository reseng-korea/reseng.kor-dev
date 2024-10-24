package com.resengkor.management.domain.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class RoleHierarchy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(referencedColumnName = "user_id",name = "ancestor_role_id", nullable = false)
    private User ancestor;  // 상위 사용자

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(referencedColumnName = "user_id",name = "descendant_role_id", nullable = false)
    private User descendant;  // 하위 사용자

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;  // 하위 사용자의 역할을 직접 나타냄

    @Column(nullable = false)
    private int depth;  // 관계 깊이

    @Builder
    public RoleHierarchy(User ancestor, User descendant, Role role, int depth) {
        this.ancestor = ancestor;
        this.descendant = descendant;
        this.role = role;
        this.depth = depth;
    }



}
