package com.resengkor.management.global.s3.controller;

import com.resengkor.management.domain.file.dto.FileRequest;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@Slf4j
@RequestMapping("/api/v1/s3")
@RequiredArgsConstructor
public class S3Controller {
    /**
     * 에디터에서 실시간으로 동작하는 로직
     * 아직 document 저장 안 한 상태
     */
    private final S3Service s3Service;


    //실시간 파일 업로드
    @PostMapping(path = "/upload/{documentType}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DataResponse<FileRequest> uploadToS3(
            @PathVariable("documentType") String documentType,
            @RequestPart(value = "file", required = false) MultipartFile multipartFile
    ) {
        log.info("------------controller : 에디터 파일 업로드  start------------");
        return s3Service.uploadFile(documentType, multipartFile);
    }

    //실시간 파일 삭제
    @DeleteMapping
    public CommonResponse deleteFromS3(@RequestParam("fileName") String fileName) {
        log.info("------------controller : 에디터 파일 삭제  start------------");
        return s3Service.deleteFileFromS3(fileName);
    }

    //실시간 다운로드
    @GetMapping(path = "/download")
    public ResponseEntity<UrlResource> downloadFromS3(@RequestParam("fileName") String fileName) {
        return s3Service.downloadFileFromS3(fileName);
    }


}
