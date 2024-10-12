package com.resengkor.management.domain.resources.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
@Builder(toBuilder = true)
@AllArgsConstructor  // 모든 필드를 포함하는 생성자 생성
public class Resources {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resources_title", nullable = false)
    private String title;

    @Column(name = "resources_content", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "resources_type")
    private  ResourceType resourceType;

    @CreatedDate //엔티티가 생성될 때 생성 시간 저장
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate //엔티티가 수정될 때 수정 시간 저장
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
