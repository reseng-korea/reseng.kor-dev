package com.resengkor.management.domain.user.controller;

import com.resengkor.management.domain.user.dto.CompanyInfoDTO;
import com.resengkor.management.domain.user.service.CompanyService;
import com.resengkor.management.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@Slf4j
public class CompanyController {
    private final CompanyService companyService;

    // 모든 회사 정보를 가져오는 API
    @GetMapping
    public DataResponse<Page<CompanyInfoDTO>> getAllCompanies(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "10") int size) {
        log.info("회사 리스트 가져오기");
        return companyService.getAllCompanies(page, size);
    }

    // 회사 상세 정보를 가져오는 API
    @GetMapping("/{companyId}")
    public DataResponse<CompanyInfoDTO> getCompanyDetails(@PathVariable Long companyId) {
        log.info("회사 상세 정보 가져오기");
        return companyService.getCompanyDetails(companyId);
    }






}
