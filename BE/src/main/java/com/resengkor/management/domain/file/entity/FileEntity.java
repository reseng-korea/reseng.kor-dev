package com.resengkor.management.domain.file.entity;

import com.resengkor.management.domain.document.entity.DocumentEntity;
import com.resengkor.management.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Entity;


@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@AllArgsConstructor
public class FileEntity  extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileUrl;  // 파일 URL

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType; // 이미지 또는 첨부파일

    @ManyToOne
    @JoinColumn(name = "document_entity_id")
    private DocumentEntity documentEntity;  // 파일이 속한 문서

    // Document 설정 메서드
    public void setDocumentEntity(DocumentEntity documentEntity) {
        this.documentEntity = documentEntity;
    }

    @Builder
    public FileEntity(String fileUrl, String fileName, String fileType) {
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.fileType = fileType;
    }
}
