package com.bookclass.ms_annotations.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "annotations",
    indexes = {
        @Index(name = "idx_student", columnList = "student_id"),
        @Index(name = "idx_teacher", columnList = "teacher_id"),
        @Index(name = "idx_fecha", columnList = "fecha"),
        @Index(name = "idx_tipo", columnList = "tipo"),
        @Index(name = "idx_student_tipo", columnList = "student_id, tipo")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Annotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AnnotationType tipo;

    @Column(nullable = false, length = 100)
    private String categoria;

    @Column(nullable = false, length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AnnotationSeverity gravedad;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        // Validar que gravedad solo se use en anotaciones negativas
        if (tipo != AnnotationType.NEGATIVA && gravedad != null) {
            throw new IllegalStateException("Gravedad solo aplica a anotaciones NEGATIVA");
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
