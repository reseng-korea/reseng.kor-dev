package com.resengkor.management.domain.user.service;

import com.resengkor.management.domain.user.dto.RegionDTO;
import com.resengkor.management.domain.user.entity.Region;
import com.resengkor.management.domain.user.repository.RegionHierarchyRepository;
import com.resengkor.management.domain.user.repository.RegionRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Getter
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class RegionService {
    private final RegionRepository regionRepository;
    private final RegionHierarchyRepository regionHierarchyRepository;

    public DataResponse<List<RegionDTO>> findByRegionType(String regionType) {
        List<Region> regions = regionRepository.findByRegionType(regionType);
        List<RegionDTO> regionDTOs = regions.stream()
                .map(region -> RegionDTO.builder()
                        .id(region.getId())
                        .regionName(region.getRegionName())
                        .regionType(region.getRegionType())
                        .build())
                .collect(Collectors.toList());
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), regionDTOs);
    }

    public DataResponse<List<RegionDTO>> findDistrictsByCity(Long cityId) {
        Region city = regionRepository.findByIdAndRegionType(cityId, "CITY")
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        List<Region> districts = regionHierarchyRepository.findDescendantsByAncestor(city);
        List<RegionDTO> districtDTOs = districts.stream()
                .map(district -> RegionDTO.builder()
                        .id(district.getId())
                        .regionName(district.getRegionName())
                        .regionType(district.getRegionType())
                        .build())
                .collect(Collectors.toList());
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), districtDTOs);
    }
}
