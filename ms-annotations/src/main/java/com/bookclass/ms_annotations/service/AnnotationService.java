package com.bookclass.ms_annotations.service;

import com.bookclass.ms_annotations.dto.request.AnnotationRequest;
import com.bookclass.ms_annotations.dto.response.AnnotationResponse;
import com.bookclass.ms_annotations.dto.response.AnnotationSummaryResponse;
import com.bookclass.ms_annotations.model.entity.AnnotationType;

import java.time.LocalDate;
import java.util.List;

public interface AnnotationService {

    // Crear anotación
    AnnotationResponse createAnnotation(AnnotationRequest request);

    // Actualizar anotación
    AnnotationResponse updateAnnotation(Long id, AnnotationRequest request);

    // Obtener anotación por ID
    AnnotationResponse getAnnotationById(Long id);

    // Obtener todas las anotaciones de un estudiante
    List<AnnotationResponse> getAnnotationsByStudent(Long studentId);

    // Obtener anotaciones de un estudiante por tipo
    List<AnnotationResponse> getAnnotationsByStudentAndType(Long studentId, AnnotationType tipo);

    // Obtener anotaciones de un estudiante en rango de fechas
    List<AnnotationResponse> getAnnotationsByStudentAndDateRange(
            Long studentId, LocalDate startDate, LocalDate endDate);

    // Obtener anotaciones registradas por un profesor
    List<AnnotationResponse> getAnnotationsByTeacher(Long teacherId);

    // Obtener resumen de comportamiento de un estudiante
    AnnotationSummaryResponse getAnnotationSummary(Long studentId);

    // Eliminar anotación
    void deleteAnnotation(Long id);
}
