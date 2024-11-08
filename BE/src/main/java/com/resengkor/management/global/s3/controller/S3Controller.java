package com.resengkor.management.global.s3.controller;

import com.resengkor.management.domain.file.dto.FileRequest;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final S3Service s3Service;

    /**
     * 이미지 파일을 S3에 업로드하는 API
     * @param multipartFile 업로드할 파일 데이터
     * @return 업로드된 파일의 URL
     * @throws IOException 파일 업로드 중 발생할 수 있는 예외
     */
    @PostMapping(path = "/upload/{documentType}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DataResponse<FileRequest> uploadToS3(
            @PathVariable String documentType,
            @RequestPart(value = "file", required = false) MultipartFile multipartFile
    ) {
        return s3Service.uploadFile(documentType, multipartFile);
    }

    @DeleteMapping(path ="/delete")
    public CommonResponse deleteFromS3(@RequestParam("fileName") String fileName) {
        return s3Service.deleteFileFromS3(fileName);
    }


}
