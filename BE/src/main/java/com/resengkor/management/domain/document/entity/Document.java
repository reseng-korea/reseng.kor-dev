package com.resengkor.management.domain.document.entity;

import com.resengkor.management.domain.file.entity.FileEntity;
import com.resengkor.management.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@AllArgsConstructor
public class Document extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;

    private String title;

    private LocalDate date;

    private String content;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileEntity> files;  // 파일 목록 (일대다 관계)

    // 파일 추가 메서드
    public void addFile(FileEntity file) {
        files.add(file);
        file.setDocument(this); // 양방향 연관 관계 설정
    }

    public void update(String title,LocalDate date, String content) {
        this.title = title;
        this.date = date;
        this.content = content;
    }



    @Builder
    public Document(DocumentType type, String title, LocalDate date, String content) {
        this.type = type;
        this.title = title;
        this.date = date;
        this.content = content;
    }

}
