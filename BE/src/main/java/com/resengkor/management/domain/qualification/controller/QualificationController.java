package com.resengkor.management.domain.qualification.controller;

import com.resengkor.management.domain.qualification.dto.QualificationDTO;
import com.resengkor.management.domain.qualification.service.QualificationService;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/certificates")
@RequiredArgsConstructor
@Slf4j
public class QualificationController {

    private final QualificationService qualificationService;


    //certificate 업로드
    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResponse uploadCertificate(@RequestPart("file") MultipartFile multipartFile){
        return qualificationService.saveQualificationUrl(multipartFile);
    }

    //삭제
    @DeleteMapping("/{id}")
    public CommonResponse deleteCertificate(@PathVariable Long id) {
        return qualificationService.deleteQualification(id);
    }

    //수정
    @PutMapping(path = "/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResponse updateCertificate(@PathVariable Long id, @RequestPart("file") MultipartFile multipartFile) {
        return qualificationService.updateQualification(id, multipartFile);
    }

    //조회
    @GetMapping
    public DataResponse<List<QualificationDTO>> getAllQualifications() {
        return qualificationService.getAllQualifications();
    }

}
