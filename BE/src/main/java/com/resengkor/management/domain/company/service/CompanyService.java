package com.resengkor.management.domain.company.service;

import com.resengkor.management.domain.company.dto.CompanyDTO;
import com.resengkor.management.domain.company.dto.CompanyMapper;
import com.resengkor.management.domain.company.entity.Company;
import com.resengkor.management.domain.company.repository.CompanyRepository;
import com.resengkor.management.domain.qna.dto.response.QuestionResponse;
import com.resengkor.management.domain.qna.entity.Question;
import com.resengkor.management.domain.user.dto.UserMapper;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    // 모든 회사 정보를 가져오는 메서드
    public DataResponse<Page<CompanyDTO>> getAllCompanies(int page, int size) {
        // 1. 페이지 요청 객체 생성
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));

        // 2. 모든 회사를 페이지 단위로 조회
        Page<Company> companies = companyRepository.findAll(pageRequest);

        // 3. 조회된 회사 목록을 CompanyDTO로 변환
        Page<CompanyDTO> companyDTOs= companies.map(companyMapper::toCompanyDTO);

        // 4. DataResponse에 담아서 반환
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), companyDTOs);
    }

    public DataResponse<CompanyDTO> getCompanyDetails(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        CompanyDTO companyDTO = companyMapper.toCompanyDTO(company);

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), companyDTO);
    }
}
