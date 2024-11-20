package com.resengkor.management.global.s3.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.resengkor.management.domain.document.dto.DocumentDetailResponse;
import com.resengkor.management.domain.file.dto.FileRequest;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.nio.file.Files;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
    private final AmazonS3 amazonS3;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${spring.servlet.multipart.max-file-size}")
    private String maxSizeString;

    /**
     * 파일을 S3에 업로드하는 메서드
     * @param dirName 디렉토리 이름 (예: "grades", "news")
     * @param multipartFile 업로드할 파일
     * @return 업로드된 파일의 URL
     */
    public DataResponse<FileRequest> uploadFile(String dirName, MultipartFile multipartFile) {
        log.info("------------Service : 에디터 파일 업로드  start------------");
        String uuid = UUID.randomUUID().toString();

        // null 체크: 원래 파일 이름이 null인지 확인
        String originalFilename = multipartFile.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new CustomException(ExceptionStatus.VALIDATION_ERROR);
        }

        // S3에 저장할 파일의 전체 경로 (디렉토리 이름 + uuid + 원본 이름) 키 값
        String s3FileName = dirName + "/" + uuid + originalFilename;


        // 업로드된 파일의 S3 URL 반환
        log.info("------------에디터/인증서 파일 업로드  메소드 start------------");
        String url = uploadFileToS3(s3FileName, multipartFile);
        log.info("s3에 파일 잘 올라감");
        FileRequest fileRequest = FileRequest.builder()
                .fileName(s3FileName)
                .fileType(multipartFile.getContentType())
                .fileUrl(url)
                .build();

        return new DataResponse<>(ResponseStatus.CREATED_SUCCESS.getCode(), ResponseStatus.CREATED_SUCCESS.getMessage(), fileRequest);
    }

    /**
     * S3에 파일을 업로드하는 메서드
     * @param s3FileName S3에 저장될 파일의 키 (경로 포함 파일 이름)
     * @param multipartFile 업로드할 파일
     * @return 업로드된 파일의 URL
     */
    public String uploadFileToS3(String s3FileName, MultipartFile multipartFile) {
        // 파일 크기 제한 체크
        long maxSize = DataSize.parse(maxSizeString).toBytes(); // maxSizeString을 바이트로 변환
        if (multipartFile.getSize() > maxSize) {
            throw new CustomException(ExceptionStatus.FILE_SIZE_LIMIT_EXCEEDED); // 적절한 예외 코드 사용
        }
        log.info("파일 크기 오류 안 남");

        // MultipartFile을 로컬 파일로 변환
        File localFile = convertMultipartFileToLocalFile(multipartFile)
                .orElseThrow(() -> new CustomException(ExceptionStatus.FILE_CONVERSION_ERROR));
        try{
            // S3에 파일 업로드 및 퍼블릭 읽기 권한 설정
            amazonS3.putObject(new PutObjectRequest(bucket, s3FileName, localFile) //버킷, 파일명, 서버저장한파일
                    .withCannedAcl(CannedAccessControlList.PublicRead));//보안 설정.외부에서 public으로 읽을 수 있음
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(ExceptionStatus.S3_CONNECTION_ERROR);
        } finally{
            deleteLocalFile(localFile); // 로컬에 생성된 임시 파일 삭제
        }
        // 업로드된 파일의 S3 URL 반환
        return amazonS3.getUrl(bucket, s3FileName).toString(); //버킷이름, 파일이름으로 s3에 저장된 주소 받음
    }

    
    /**
     * 로컬에 생성된 파일을 삭제하는 메서드
     * @param file 삭제할 로컬 파일
     */
    private void deleteLocalFile(File file) {
        if (file.exists() && !file.delete()) {
            //파일이 존재하면 파일을 삭제하는데 return값이 false면 로컬 파일 실패한 것
            log.warn("로컬 파일 삭제 실패: {}", file.getName());
        }
    }

    /**
     * MultipartFile을 로컬 파일로 변환하는 메서드
     * @param file 변환할 MultipartFile
     * @return 변환된 로컬 파일 객체 (Optional)
     */
    private Optional<File> convertMultipartFileToLocalFile(MultipartFile file) {
        // 업로드된 파일의 이름을 사용해 새 파일 생성
        File convertedFile = new File(file.getOriginalFilename());
        //1
        try {
            if (convertedFile.createNewFile()) {
                // 파일에 데이터를 씁니다.
                try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
                    fos.write(file.getBytes());
                }
                return Optional.of(convertedFile);
            }
        } catch (IOException e) {
            throw new CustomException(ExceptionStatus.FILE_CONVERSION_ERROR);
        }
        return Optional.empty();
    }


    /**
     * S3에서 파일을 다운로드하는 메서드
     * @param fileName S3에 저장된 파일 이름 (전체 키)
     * @return 파일 데이터를 포함한 ResponseEntity
     */
    public ResponseEntity<byte[]> downloadFileFromS3(String fileName) {
        log.info("------------Service : 파일 다운로드 start------------");
        try {
            S3Object s3Object = amazonS3.getObject(new GetObjectRequest(bucket, fileName));
            S3ObjectInputStream inputStream = s3Object.getObjectContent();
            byte[] fileBytes = inputStream.readAllBytes();

            // MIME 타입을 파일 확장자에 따라 동적으로 설정
            String contentType = s3Object.getObjectMetadata().getContentType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // 기본값
            }

//            String encodedFileName = URLEncoder.encode(fileName, "UTF-8").replace("+", "%20");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(fileBytes.length);
            headers.setContentDisposition(
                    ContentDisposition.builder("attachment")
                            .filename(fileName, StandardCharsets.UTF_8) // UTF-8 지원 파일 이름
                            .build()
            );

            return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            throw new CustomException(ExceptionStatus.DATA_NOT_FOUND);
        }
    }



    /**
     * S3에서 파일을 삭제하는 메서드
     * @param fileName 삭제할 파일의 S3 키 (경로 포함 파일 이름)
     * @return 삭제 성공 응답
     */
    public CommonResponse deleteFileFromS3(String fileName) {
        log.info("------------Service : 파일 삭제 start------------");
        amazonS3.deleteObject(bucket, fileName);
        return new CommonResponse(ResponseStatus.DELETED_SUCCESS.getCode(), ResponseStatus.DELETED_SUCCESS.getMessage());
    }


    /**
     * S3에 파일을 업데이트하는 메서드 (기존 파일 삭제 후 새 파일 업로드)
     * @param oldFileName 기존 파일의 S3 키
     * @param newFileName 새 파일의 S3 키
     * @param multipartFile 업로드할 새 파일
     * @return 새 파일의 URL
     */
    public String updateFileInS3(String oldFileName, String newFileName, MultipartFile multipartFile) {
        log.info("------------Service : 파일 수정 start------------");
        // 기존 파일 삭제
        amazonS3.deleteObject(bucket, oldFileName);

        return uploadFileToS3(newFileName, multipartFile);
    }

}
