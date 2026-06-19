package com.bookclass.ms_annotations.controller;

import com.bookclass.ms_annotations.dto.request.AnnotationRequest;
import com.bookclass.ms_annotations.dto.response.AnnotationResponse;
import com.bookclass.ms_annotations.dto.response.AnnotationSummaryResponse;
import com.bookclass.ms_annotations.model.entity.AnnotationSeverity;
import com.bookclass.ms_annotations.model.entity.AnnotationType;
import com.bookclass.ms_annotations.service.AnnotationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class AnnotationControllerTest {

    @Mock
    private AnnotationService annotationService;

    @InjectMocks
    private AnnotationController annotationController;

    private AnnotationResponse annotationResponse;
    private AnnotationRequest annotationRequest;
    private AnnotationSummaryResponse summaryResponse;

    @BeforeEach
    void setUp() {
        annotationResponse = AnnotationResponse.builder()
                .id(1L)
                .studentId(1L)
                .teacherId(10L)
                .tipo(AnnotationType.NEGATIVA)
                .categoria("Conducta")
                .descripcion("Comportamiento inadecuado en clase")
                .fecha(LocalDate.of(2026, 6, 19))
                .gravedad(AnnotationSeverity.LEVE)
                .build();

        annotationRequest = AnnotationRequest.builder()
                .studentId(1L)
                .teacherId(10L)
                .tipo(AnnotationType.NEGATIVA)
                .categoria("Conducta")
                .descripcion("Comportamiento inadecuado en clase")
                .fecha(LocalDate.of(2026, 6, 19))
                .gravedad(AnnotationSeverity.LEVE)
                .build();

        summaryResponse = AnnotationSummaryResponse.builder()
                .studentId(1L)
                .totalAnnotations(10L)
                .positiveCount(7L)
                .negativeCount(2L)
                .neutralCount(1L)
                .leveCount(2L)
                .graveCount(0L)
                .muyGraveCount(0L)
                .comportamiento("BUENO")
                .build();
    }

    @Test
    void createAnnotation_shouldReturn201() {
        when(annotationService.createAnnotation(any(AnnotationRequest.class))).thenReturn(annotationResponse);

        ResponseEntity<AnnotationResponse> response = annotationController.createAnnotation(annotationRequest);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getStudentId());
    }

    @Test
    void updateAnnotation_shouldReturn200() {
        when(annotationService.updateAnnotation(eq(1L), any(AnnotationRequest.class))).thenReturn(annotationResponse);

        ResponseEntity<AnnotationResponse> response = annotationController.updateAnnotation(1L, annotationRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void getAnnotationById_shouldReturn200() {
        when(annotationService.getAnnotationById(1L)).thenReturn(annotationResponse);

        ResponseEntity<AnnotationResponse> response = annotationController.getAnnotationById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void getAnnotationsByStudent_shouldReturn200() {
        when(annotationService.getAnnotationsByStudent(1L)).thenReturn(List.of(annotationResponse));

        ResponseEntity<List<AnnotationResponse>> response = annotationController.getAnnotationsByStudent(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getAnnotationsByStudentAndType_shouldReturn200() {
        when(annotationService.getAnnotationsByStudentAndType(1L, AnnotationType.NEGATIVA))
                .thenReturn(List.of(annotationResponse));

        ResponseEntity<List<AnnotationResponse>> response = 
                annotationController.getAnnotationsByStudentAndType(1L, AnnotationType.NEGATIVA);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getAnnotationsByStudentAndDateRange_shouldReturn200() {
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 30);
        when(annotationService.getAnnotationsByStudentAndDateRange(1L, start, end))
                .thenReturn(List.of(annotationResponse));

        ResponseEntity<List<AnnotationResponse>> response = 
                annotationController.getAnnotationsByStudentAndDateRange(1L, start, end);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getAnnotationsByTeacher_shouldReturn200() {
        when(annotationService.getAnnotationsByTeacher(10L)).thenReturn(List.of(annotationResponse));

        ResponseEntity<List<AnnotationResponse>> response = annotationController.getAnnotationsByTeacher(10L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getAnnotationSummary_shouldReturn200() {
        when(annotationService.getAnnotationSummary(1L)).thenReturn(summaryResponse);

        ResponseEntity<AnnotationSummaryResponse> response = annotationController.getAnnotationSummary(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("BUENO", response.getBody().getComportamiento());
        assertEquals(10L, response.getBody().getTotalAnnotations());
    }

    @Test
    void deleteAnnotation_shouldReturn204() {
        doNothing().when(annotationService).deleteAnnotation(1L);

        ResponseEntity<Void> response = annotationController.deleteAnnotation(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(annotationService, times(1)).deleteAnnotation(1L);
    }
}
