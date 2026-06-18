package com.bookclass.ms_annotations.dto.response;

import com.bookclass.ms_annotations.model.entity.AnnotationSeverity;
import com.bookclass.ms_annotations.model.entity.AnnotationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnotationResponse {
    private Long id;
    private Long studentId;
    private Long teacherId;
    private AnnotationType tipo;
    private String categoria;
    private String descripcion;
    private LocalDate fecha;
    private AnnotationSeverity gravedad;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
