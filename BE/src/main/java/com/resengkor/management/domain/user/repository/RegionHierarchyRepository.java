package com.resengkor.management.domain.user.repository;

import com.resengkor.management.domain.user.entity.Region;
import com.resengkor.management.domain.user.entity.RegionHierarchy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RegionHierarchyRepository extends JpaRepository<RegionHierarchy, Long> {
    @Query("SELECT rh.descendantRegion FROM RegionHierarchy rh WHERE rh.ancestorRegion = :ancestor AND rh.descendantRegion != :ancestor")
    List<Region> findDescendantsByAncestor(@Param("ancestor") Region ancestor);
}
