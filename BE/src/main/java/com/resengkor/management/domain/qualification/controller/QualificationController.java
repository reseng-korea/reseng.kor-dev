package com.resengkor.management.domain.qualification.controller;

import com.resengkor.management.domain.qualification.dto.QualificationDTO;
import com.resengkor.management.domain.qualification.service.QualificationService;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/qualifications")
@RequiredArgsConstructor
@Slf4j
public class QualificationController {

    private final QualificationService qualificationService;


    //Qualification 업로드
    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('MANAGER')")
    public CommonResponse uploadQualification(@RequestPart("file") MultipartFile multipartFile){
        return qualificationService.saveQualificationUrl(multipartFile);
    }

    //삭제
    @DeleteMapping("/{qualificationId}")
    @PreAuthorize("hasRole('MANAGER')")
    public CommonResponse deleteQualification(@PathVariable("qualificationId") Long id) {
        return qualificationService.deleteQualification(id);
    }

    //수정
    @PutMapping(path = "/{qualificationId}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('MANAGER')")
    public CommonResponse updateQualification(@PathVariable("qualificationId") Long id, @RequestPart("file") MultipartFile multipartFile) {
        return qualificationService.updateQualification(id, multipartFile);
    }

    //조회
    @GetMapping
    @PreAuthorize("permitAll()")
    public DataResponse<List<QualificationDTO>> getAllQualifications() {
        return qualificationService.getAllQualifications();
    }

}
