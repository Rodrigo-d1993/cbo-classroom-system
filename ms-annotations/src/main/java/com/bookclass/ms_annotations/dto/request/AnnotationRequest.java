package com.bookclass.ms_annotations.dto.request;

import com.bookclass.ms_annotations.model.entity.AnnotationSeverity;
import com.bookclass.ms_annotations.model.entity.AnnotationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnotationRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Teacher ID is required")
    private Long teacherId;

    @NotNull(message = "Tipo is required")
    private AnnotationType tipo;

    @NotBlank(message = "Categoria is required")
    @Size(max = 100, message = "Categoria must not exceed 100 characters")
    private String categoria;

    @NotBlank(message = "Descripcion is required")
    @Size(max = 1000, message = "Descripcion must not exceed 1000 characters")
    private String descripcion;

    @NotNull(message = "Fecha is required")
    @PastOrPresent(message = "Fecha cannot be in the future")
    private LocalDate fecha;

    private AnnotationSeverity gravedad; // Solo para tipo NEGATIVA
}
