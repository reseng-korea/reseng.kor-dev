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

    @Column(nullable = false)
    private int depth;  // 관계 깊이

    @Builder
    public RoleHierarchy(User ancestor, User descendant, int depth) {
        this.ancestor = ancestor;
        this.descendant = descendant;
        this.depth = depth;
    }

    public void updateRoleHierarchy(User ancestor, User descendant, int depth) {
        this.ancestor = ancestor;
        this.descendant = descendant;
        this.depth = depth;
    }
}
