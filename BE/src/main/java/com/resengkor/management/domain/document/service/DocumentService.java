package com.resengkor.management.domain.document.service;


import com.resengkor.management.domain.document.dto.DocumentDetailResponse;
import com.resengkor.management.domain.document.dto.DocumentRequest;
import com.resengkor.management.domain.document.dto.DocumentResponse;
import com.resengkor.management.domain.document.entity.DocumentEntity;
import com.resengkor.management.domain.document.entity.DocumentType;
import com.resengkor.management.domain.document.repository.DocumentRepository;
import com.resengkor.management.domain.file.dto.FileRequest;
import com.resengkor.management.domain.file.entity.FileEntity;
import com.resengkor.management.domain.file.repository.FileRepository;
import com.resengkor.management.global.exception.CustomException;
import com.resengkor.management.global.exception.ExceptionStatus;
import com.resengkor.management.global.response.CommonResponse;
import com.resengkor.management.global.response.DataResponse;
import com.resengkor.management.global.response.ResponseStatus;
import com.resengkor.management.global.s3.service.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {
    private final S3Service s3Service;
    private final FileRepository fileRepository;
    private final DocumentRepository documentRepository;


    //생성
    @Transactional
    public CommonResponse createDocument(String documentType,DocumentRequest dto) {
        // HTML에서 썸네일 URL 추출
        String thumbnailUrl = extractThumbnailUrl(dto.getContent());

        //Document 엔티티 생성
        DocumentEntity documentEntity = DocumentEntity.builder()
                .type(DocumentType.valueOf(documentType.toUpperCase()))
                .title(dto.getTitle())
                .date(dto.getDate())
                .content(dto.getContent())
                .thumbnailUrl(thumbnailUrl)
                .build();
        List<FileRequest> imageFiles = dto.getImages().stream()
                .filter(file -> file.getFileType().startsWith("image/"))  // MIME 타입이 "image/"로 시작하는 파일 필터링
                .collect(Collectors.toList());

        List<FileRequest> nonImageFiles = dto.getFiles().stream()
                .filter(file -> !file.getFileType().startsWith("image/"))  // MIME 타입이 "image/"로 시작하지 않는 파일 필터링
                .collect(Collectors.toList());

        // 이미지 파일을 처리 (images)
        imageFiles.forEach(fileRequest -> {
            FileEntity newImageFile = FileEntity.builder()
                    .fileName(fileRequest.getFileName())
                    .fileType(fileRequest.getFileType())
                    .fileUrl(fileRequest.getFileUrl())
                    .build();
            documentEntity.addFile(newImageFile);  // 연관관계 편의 메서드 사용
        });

        // 이미지가 아닌 파일을 처리 (files)
        nonImageFiles.forEach(fileRequest -> {
            FileEntity newFile = FileEntity.builder()
                    .fileName(fileRequest.getFileName())
                    .fileType(fileRequest.getFileType())
                    .fileUrl(fileRequest.getFileUrl())
                    .build();
            documentEntity.addFile(newFile);  // 연관관계 편의 메서드 사용
        });

        documentRepository.save(documentEntity);

        return new CommonResponse(ResponseStatus.CREATED_SUCCESS.getCode(), ResponseStatus.CREATED_SUCCESS.getMessage());
    }

    /**
     * HTML에서 첫 번째 이미지의 URL을 추출하는 메서드
     *
     * @param htmlContent HTML 문자열
     * @return 첫 번째 이미지의 URL (없으면 null 반환)
     */
    public static String extractThumbnailUrl(String htmlContent) {
        // HTML 파싱
        Document document = Jsoup.parse(htmlContent);

        // 첫 번째 <img> 태그 선택
        Element imgElement = document.selectFirst("img");

        // <img> 태그가 존재하면 src 속성 반환
        if (imgElement != null) {
            return imgElement.attr("src");
        }

        // 이미지 태그가 없으면 null 반환
        return null;
    }



    //조회
    public DataResponse<Page<DocumentResponse>> getDocumentList(String documentType,int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<DocumentEntity> documentPage = documentRepository.findByType(DocumentType.valueOf(documentType.toUpperCase()), pageRequest);

        Page<DocumentResponse> documentResponsePage = documentPage.map(DocumentResponse::fromEntity);

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), documentResponsePage);
    }

    //세부 사항 조회
    public DataResponse<DocumentDetailResponse> getDocumentDetail(String documentType,Long documentId) {
        DocumentEntity documentEntity = documentRepository.findByIdAndType(documentId, DocumentType.valueOf(documentType.toUpperCase()))
                .orElseThrow(() -> new CustomException(ExceptionStatus.INVALID_DOCUMENT_TYPE));

        DocumentDetailResponse detailResponse = DocumentDetailResponse.fromEntity(documentEntity);

        return new DataResponse<>(ResponseStatus.RESPONSE_SUCCESS.getCode(), ResponseStatus.RESPONSE_SUCCESS.getMessage(), detailResponse);
    }

    //수정
    @Transactional
    public CommonResponse updateDocument(String documentType,Long documentId, DocumentRequest request) {
        DocumentEntity documentEntity = documentRepository.findByIdAndType(documentId, DocumentType.valueOf(documentType.toUpperCase()))
                .orElseThrow(() -> new CustomException(ExceptionStatus.INVALID_DOCUMENT_TYPE));

        documentEntity.update(request.getTitle(), request.getDate(), request.getContent());

        documentEntity.getFiles().clear();  // 기존 파일 제거
        // 파일들을 이미지와 일반 파일로 구분
        List<FileRequest> imageFiles = request.getImages().stream()
                .filter(file -> file.getFileType().startsWith("image/"))  // MIME 타입이 "image/"로 시작하는 파일 필터링
                .collect(Collectors.toList());

        List<FileRequest> nonImageFiles = request.getFiles().stream()
                .filter(file -> !file.getFileType().startsWith("image/"))  // MIME 타입이 "image/"로 시작하지 않는 파일 필터링
                .collect(Collectors.toList());

        // 이미지 파일을 처리 (images)
        imageFiles.forEach(fileRequest -> {
            FileEntity newImageFile = FileEntity.builder()
                    .fileName(fileRequest.getFileName())
                    .fileType(fileRequest.getFileType())
                    .fileUrl(fileRequest.getFileUrl())
                    .build();
            documentEntity.addFile(newImageFile);  // 연관관계 편의 메서드 사용
        });

        // 이미지가 아닌 파일을 처리 (files)
        nonImageFiles.forEach(fileRequest -> {
            FileEntity newFile = FileEntity.builder()
                    .fileName(fileRequest.getFileName())
                    .fileType(fileRequest.getFileType())
                    .fileUrl(fileRequest.getFileUrl())
                    .build();
            documentEntity.addFile(newFile);  // 연관관계 편의 메서드 사용
        });

        return new CommonResponse(ResponseStatus.UPDATED_SUCCESS.getCode(), ResponseStatus.UPDATED_SUCCESS.getMessage());
    }

    //삭제
    @Transactional
    public CommonResponse deleteDocument(String documentType, Long documentId) {
        // 해당 id와 documentType이 같은지 검증
        documentRepository.findByIdAndType(documentId, DocumentType.valueOf(documentType.toUpperCase()))
                .orElseThrow(() -> new CustomException(ExceptionStatus.INVALID_DOCUMENT_TYPE));

        // 파일 이름 목록 조회
        List<FileEntity> files = fileRepository.findByDocumentEntityId(documentId);

        // S3에서 파일 삭제
        files.forEach(file -> s3Service.deleteFileFromS3(file.getFileName()));

        // DB에서 파일 삭제
        fileRepository.deleteAll(files);

        // 게시물 삭제
        documentRepository.deleteById(documentId);

        return new CommonResponse(ResponseStatus.DELETED_SUCCESS.getCode(),
                ResponseStatus.DELETED_SUCCESS.getMessage());
    }

    public ResponseEntity<UrlResource> downloadDocumentFile(String documentType, Long fileId) {
        // 파일 ID를 통해 해당 파일 찾기
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new CustomException(ExceptionStatus.DATA_NOT_FOUND));
        if(!documentType.equals(file.getDocumentEntity().getType().toString().toLowerCase())){
            throw new CustomException(ExceptionStatus.INVALID_DOCUMENT_TYPE);
        }

        // S3에서 파일 다운로드
        return s3Service.downloadFileFromS3(file.getFileName());
    }
}
