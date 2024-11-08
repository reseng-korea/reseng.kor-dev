package com.resengkor.management.domain.user.controller;

import com.resengkor.management.domain.user.dto.RegionDTO;
import com.resengkor.management.domain.user.repository.RegionRepository;
import com.resengkor.management.domain.user.service.RegionService;
import com.resengkor.management.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/regions")
@RequiredArgsConstructor
@Slf4j
public class RegionController {
    private final RegionService regionService;

    // 모든 CITY 카테고리를 가져오는 API
    @GetMapping("/cities")
    public DataResponse<List<RegionDTO>> getCities() {
        return regionService.findByRegionType("CITY");
    }

    // 특정 CITY에 해당하는 DISTRICT를 가져오는 API
    @GetMapping("/{cityId}/districts")
    public DataResponse<List<RegionDTO>> getDistrictsByCity(@PathVariable Long cityId) {
        return regionService.findDistrictsByCity(cityId);
    }
}
