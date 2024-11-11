package com.resengkor.management.domain.user.service;

import com.resengkor.management.domain.user.dto.CompanyInfoDTO;
import com.resengkor.management.domain.user.dto.UserMapper;
import com.resengkor.management.domain.user.entity.Role;
import com.resengkor.management.domain.user.entity.User;
import com.resengkor.management.domain.user.entity.UserProfile;
import com.resengkor.management.domain.user.repository.UserRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // 모든 회사 정보를 가져오는 메서드
    public DataResponse<Page<CompanyInfoDTO>> getAllCompanies(int page, int size) {
        // 페이지 요청 객체 생성
        PageRequest pageRequest = PageRequest.of(page, size);

        // 필터링할 역할 목록 생성
        List<Role> roles = Arrays.asList(Role.ROLE_DISTRIBUTOR, Role.ROLE_MANAGER);
        // User 엔티티를 페이지네이션을 사용하여 가져옴
        Page<User> users = userRepository.findAllWithProfileAndRegion(roles, pageRequest);

        // User 엔티티를 CompanyInfoDTO로 변환하면서 null 처리
        Page<CompanyInfoDTO> companyInfoDTOs = users.map(userMapper::toCompanyInfoDTO);

        // DataResponse에 담아서 반환
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), companyInfoDTOs);
    }

    public DataResponse<CompanyInfoDTO> getCompanyDetails(Long companyId) {
        User user = userRepository.findUserWithProfileAndRegionById(companyId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.USER_NOT_FOUND));

        CompanyInfoDTO companyInfoDTO = userMapper.toCompanyInfoDTO(user);

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), companyInfoDTO);
    }
}
