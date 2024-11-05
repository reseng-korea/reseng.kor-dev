package com.resengkor.management.domain.resources.entity;

import com.resengkor.management.global.common.BaseEntity;
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
public class Resources extends BaseEntity {
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
}
