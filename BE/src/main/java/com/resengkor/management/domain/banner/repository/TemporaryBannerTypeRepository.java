package com.resengkor.management.domain.banner.repository;

import com.resengkor.management.domain.banner.entity.TemporaryBannerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TemporaryBannerTypeRepository extends JpaRepository<TemporaryBannerType, Long> {

}
