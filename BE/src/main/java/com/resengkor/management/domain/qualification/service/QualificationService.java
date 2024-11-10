package com.resengkor.management.domain.qualification.service;

import com.resengkor.management.domain.qualification.dto.QualificationDTO;
import com.resengkor.management.domain.qualification.entity.Qualification;
import com.resengkor.management.domain.qualification.repository.QualificationRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QualificationService {
    private final S3Service s3Service;
    private final QualificationRepository qualificationRepository;
    private final String DIR_NAME = "qualification";

    //생성
    public CommonResponse saveQualificationUrl(MultipartFile multipartFile) {
        // uuid 생성
        String uuid = UUID.randomUUID().toString();

        // null 체크: 원래 파일 이름이 null인지 확인
        String originalFilename = multipartFile.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("파일 이름이 유효하지 않습니다.");
        }

        // S3에 저장할 파일의 전체 경로 (디렉토리 이름 + uuid + 원본 이름) key값
        String s3FileName = DIR_NAME + "/" + uuid + originalFilename;

        String url = s3Service.uploadFileToS3(s3FileName, multipartFile);

        // URL을 DB에 저장
        Qualification qualification = Qualification.builder()
                .fileUrl(url)
                .fileName(s3FileName)
                .build();
        qualificationRepository.save(qualification);

        return new CommonResponse(ResponseStatus.CREATED_SUCCESS.getCode(),
                ResponseStatus.CREATED_SUCCESS.getMessage());
    }

    //조회
    public DataResponse<List<QualificationDTO>> getAllQualifications() {
        List<QualificationDTO> qualificationDTO = qualificationRepository.findAll().stream()
                .map(QualificationDTO::fromEntity)
                .collect(Collectors.toList());
        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(),
                ResponseStatus.RESPONSE_SUCCESS.getMessage(), qualificationDTO);
    }

    //삭제
    public CommonResponse deleteQualification(Long id) {
        // 파일명 조회
        String fileName = qualificationRepository.findFileNameById(id)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));
        // S3에서 파일 삭제
        s3Service.deleteFileFromS3(fileName);
        // DB에서 파일 정보 삭제
        qualificationRepository.deleteById(id);
        return new CommonResponse(ResponseStatus.DELETED_SUCCESS.getCode(),
                ResponseStatus.DELETED_SUCCESS.getMessage());

    }

    //수정
    public CommonResponse updateQualification(Long id, MultipartFile multipartFile) {
        String oldFileName = qualificationRepository.findFileNameById(id)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        // uuid 생성
        String uuid = UUID.randomUUID().toString();

        // null 체크: 원래 파일 이름이 null인지 확인
        String originalFilename = multipartFile.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("파일 이름이 유효하지 않습니다.");
        }

        // S3에 저장할 파일의 전체 경로 (디렉토리 이름 + uuid + 원본 이름) key값
        String newFileName = DIR_NAME + "/" + uuid + originalFilename;

        String newUrl = s3Service.updateFileInS3(oldFileName, newFileName, multipartFile);

        // 기존 Qualification 엔터티 조회 및 업데이트
        Qualification qualification = qualificationRepository.findById(id)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));

        // 새 URL과 파일 이름으로 업데이트
        qualification.updateFileInfo(newUrl, newFileName);  // updateFileInfo 메서드는 다음에 설명

        // 변경된 정보를 저장
        qualificationRepository.save(qualification);


        return new CommonResponse(ResponseStatus.UPDATED_SUCCESS.getCode(),
                ResponseStatus.UPDATED_SUCCESS.getMessage());
    }
}
