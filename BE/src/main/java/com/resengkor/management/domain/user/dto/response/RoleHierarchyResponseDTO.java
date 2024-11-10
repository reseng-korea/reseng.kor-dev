package com.resengkor.management.domain.user.dto.response;

import com.resengkor.management.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoleHierarchyResponseDTO {

    private Long id;

    private Long ancestorId;
    private Long descendantId;

    private String ancestorCompanyName;
    private String descendantCompanyName;

    private String ancestorRepresentativeName;
    private String descendantRepresentativeName;

    private int depth;

    @Builder
    public RoleHierarchyResponseDTO(Long id, Long ancestorId, Long descendantId, String ancestorCompanyName, String descendantCompanyName, String ancestorRepresentativeName, String descendantRepresentativeName, int depth) {
        this.id = id;
        this.ancestorId = ancestorId;
        this.descendantId = descendantId;
        this.ancestorCompanyName = ancestorCompanyName;
        this.descendantCompanyName = descendantCompanyName;
        this.ancestorRepresentativeName = ancestorRepresentativeName;
        this.descendantRepresentativeName = descendantRepresentativeName;
        this.depth = depth;
    }
}
