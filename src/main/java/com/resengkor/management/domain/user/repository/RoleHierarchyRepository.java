package com.resengkor.management.domain.user.repository;


import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.RoleHierarchy;
import com.resengkor.management.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RoleHierarchyRepository extends JpaRepository<RoleHierarchy, Long> {

    // 상위 사용자가 하위 사용자를 관리하는지 확인
    @Query("SELECT COUNT(rh) > 0 FROM RoleHierarchy rh WHERE rh.ancestor = :upperUser AND rh.descendant = :lowerUser")
    boolean existsByAncestorAndDescendant(@Param("upperUser") User upperUser, @Param("lowerUser") User lowerUser);

    //자식만 찾는 쿼리
    @Query("SELECT rh.descendant FROM RoleHierarchy rh WHERE rh.ancestor.id = :lowerUserId AND rh.depth = 1")
    List<User> findDirectChildrenByAncestor(@Param("lowerUserId") Long lowerUserId);

    // 새로운 경로 추가 (자기 참조 없이)
    @Modifying
    @Query(value = "INSERT INTO role_hierarchy (ancestor_role_id, descendant_role_id, depth, role) " +
            "SELECT rh.ancestor_role_id, :lowerUserId, rh.depth + 1, :newRole FROM role_hierarchy rh " +
            "WHERE rh.descendant_role_id = :newParentId", nativeQuery = true)
    void addNewPathsWithoutSelf(@Param("lowerUserId") Long lowerUserId, @Param("newParentId") Long newParentId, @Param("newRole") String newRole);

    // 자기 역할 업데이트
    @Modifying
    @Query("UPDATE RoleHierarchy rh SET rh.role = :newRole WHERE rh.descendant = :user")
    void updateRole(@Param("user") User user, @Param("newRole") Role newRole);

    // 이동할 노드와 그 자손들의 상위 경로를 삭제 (자기자신이랑 이동노드와 자손 관계는 안 지움)
    @Modifying
    @Query("DELETE FROM RoleHierarchy rh WHERE rh.descendant.id IN " +
            "(SELECT rh2.descendant.id FROM RoleHierarchy rh2 WHERE rh2.ancestor.id = :movingNodeId) " +
            "AND rh.ancestor.id <> :movingNodeId " +
            "AND rh.ancestor.id <> rh.descendant.id")
    void deleteByDescendant(@Param("movingNodeId") Long movingNodeId);

    // 이동할 노드와 그 자손들을 새로운 조상에 연결
    @Modifying
    @Query(value = "INSERT INTO role_hierarchy (ancestor_role_id, descendant_role_id, depth, role) " +
            "SELECT supertree.ancestor_role_id, subtree.descendant_role_id, supertree.depth + subtree.depth+1, subtree.role " +
            "FROM role_hierarchy AS supertree " +
            "CROSS JOIN role_hierarchy AS subtree " +
            "WHERE supertree.descendant_role_id = :newParentId " +
            "AND subtree.ancestor_role_id = :movingNodeId", nativeQuery = true)
    void addNewPathsForChildrenWithoutSelf(@Param("movingNodeId") Long movingNodeId, @Param("newParentId") Long newParentId);



    // 새로운 역할을 가진 조상 찾기
    @Query("SELECT rh.ancestor FROM RoleHierarchy rh WHERE rh.descendant = :lowerUser AND rh.depth > 0 ORDER BY rh.depth ASC")
    List<User> findAncestorsByDescendant(@Param("lowerUser") User lowerUser);

}