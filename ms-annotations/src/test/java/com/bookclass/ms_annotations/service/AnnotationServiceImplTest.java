package com.bookclass.ms_annotations.service;

import com.bookclass.ms_annotations.dto.request.AnnotationRequest;
import com.bookclass.ms_annotations.dto.response.AnnotationResponse;
import com.bookclass.ms_annotations.dto.response.AnnotationSummaryResponse;
import com.bookclass.ms_annotations.exception.ResourceNotFoundException;
import com.bookclass.ms_annotations.model.entity.Annotation;
import com.bookclass.ms_annotations.model.entity.AnnotationSeverity;
import com.bookclass.ms_annotations.model.entity.AnnotationType;
import com.bookclass.ms_annotations.repository.AnnotationRepository;
import com.bookclass.ms_annotations.service.impl.AnnotationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class AnnotationServiceImplTest {

    @Mock
    private AnnotationRepository annotationRepository;

    @InjectMocks
    private AnnotationServiceImpl annotationService;

    private Annotation testAnnotation;
    private AnnotationRequest annotationRequest;

    @BeforeEach
    void setUp() {
        testAnnotation = new Annotation();
        testAnnotation.setId(1L);
        testAnnotation.setStudentId(1L);
        testAnnotation.setTeacherId(10L);
        testAnnotation.setTipo(AnnotationType.NEGATIVA);
        testAnnotation.setCategoria("Conducta");
        testAnnotation.setDescripcion("Comportamiento inadecuado");
        testAnnotation.setFecha(LocalDate.of(2026, 6, 19));
        testAnnotation.setGravedad(AnnotationSeverity.LEVE);

        annotationRequest = AnnotationRequest.builder()
                .studentId(1L)
                .teacherId(10L)
                .tipo(AnnotationType.NEGATIVA)
                .categoria("Conducta")
                .descripcion("Comportamiento inadecuado")
                .fecha(LocalDate.of(2026, 6, 19))
                .gravedad(AnnotationSeverity.LEVE)
                .build();
    }

    @Test
    void createAnnotation_shouldReturnAnnotationResponse() {
        when(annotationRepository.save(any(Annotation.class))).thenReturn(testAnnotation);

        AnnotationResponse response = annotationService.createAnnotation(annotationRequest);

        assertNotNull(response);
        assertEquals(1L, response.getStudentId());
        assertEquals(AnnotationType.NEGATIVA, response.getTipo());
        verify(annotationRepository, times(1)).save(any(Annotation.class));
    }

    @Test
    void createAnnotation_shouldThrowWhenGravedadForNonNegativa() {
        AnnotationRequest invalidRequest = AnnotationRequest.builder()
                .studentId(1L)
                .teacherId(10L)
                .tipo(AnnotationType.POSITIVA)
                .categoria("Logro")
                .descripcion("Excelente trabajo")
                .fecha(LocalDate.of(2026, 6, 19))
                .gravedad(AnnotationSeverity.LEVE) // no debería tener gravedad si es POSITIVA
                .build();

        assertThrows(IllegalArgumentException.class, () -> annotationService.createAnnotation(invalidRequest));
        verify(annotationRepository, never()).save(any(Annotation.class));
    }

    @Test
    void createAnnotation_shouldThrowWhenNegativaSinGravedad() {
        AnnotationRequest invalidRequest = AnnotationRequest.builder()
                .studentId(1L)
                .teacherId(10L)
                .tipo(AnnotationType.NEGATIVA)
                .categoria("Conducta")
                .descripcion("Mala conducta")
                .fecha(LocalDate.of(2026, 6, 19))
                .gravedad(null) // NEGATIVA debe tener gravedad
                .build();

        assertThrows(IllegalArgumentException.class, () -> annotationService.createAnnotation(invalidRequest));
        verify(annotationRepository, never()).save(any(Annotation.class));
    }

    @Test
    void updateAnnotation_shouldReturnUpdatedAnnotation() {
        AnnotationRequest updateRequest = AnnotationRequest.builder()
                .studentId(1L)
                .teacherId(10L)
                .tipo(AnnotationType.NEGATIVA)
                .categoria("Conducta Actualizada")
                .descripcion("Descripción actualizada")
                .fecha(LocalDate.of(2026, 6, 20))
                .gravedad(AnnotationSeverity.GRAVE)
                .build();

        when(annotationRepository.findById(1L)).thenReturn(Optional.of(testAnnotation));
        when(annotationRepository.save(any(Annotation.class))).thenReturn(testAnnotation);

        AnnotationResponse response = annotationService.updateAnnotation(1L, updateRequest);

        assertNotNull(response);
        verify(annotationRepository, times(1)).save(any(Annotation.class));
    }

    @Test
    void updateAnnotation_shouldThrowWhenNotFound() {
        when(annotationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
                () -> annotationService.updateAnnotation(99L, annotationRequest));
    }

    @Test
    void getAnnotationById_shouldReturnAnnotation() {
        when(annotationRepository.findById(1L)).thenReturn(Optional.of(testAnnotation));

        AnnotationResponse response = annotationService.getAnnotationById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    void getAnnotationById_shouldThrowWhenNotFound() {
        when(annotationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> annotationService.getAnnotationById(99L));
    }

    @Test
    void getAnnotationsByStudent_shouldReturnList() {
        when(annotationRepository.findByStudentIdOrderByFechaDesc(1L)).thenReturn(List.of(testAnnotation));

        List<AnnotationResponse> response = annotationService.getAnnotationsByStudent(1L);

        assertNotNull(response);
        assertEquals(1, response.size());
    }

    @Test
    void getAnnotationsByStudentAndType_shouldReturnList() {
        when(annotationRepository.findByStudentIdAndTipoOrderByFechaDesc(1L, AnnotationType.NEGATIVA))
                .thenReturn(List.of(testAnnotation));

        List<AnnotationResponse> response = annotationService.getAnnotationsByStudentAndType(1L, AnnotationType.NEGATIVA);

        assertNotNull(response);
        assertEquals(1, response.size());
    }

    @Test
    void getAnnotationsByStudentAndDateRange_shouldReturnList() {
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 30);
        when(annotationRepository.findByStudentIdAndFechaBetweenOrderByFecha(1L, start, end))
                .thenReturn(List.of(testAnnotation));

        List<AnnotationResponse> response = annotationService.getAnnotationsByStudentAndDateRange(1L, start, end);

        assertNotNull(response);
        assertEquals(1, response.size());
    }

    @Test
    void getAnnotationsByTeacher_shouldReturnList() {
        when(annotationRepository.findByTeacherIdOrderByFechaDesc(10L)).thenReturn(List.of(testAnnotation));

        List<AnnotationResponse> response = annotationService.getAnnotationsByTeacher(10L);

        assertNotNull(response);
        assertEquals(1, response.size());
    }

    @Test
    void getAnnotationSummary_shouldReturnSummaryWithExcelente() {
        when(annotationRepository.countByStudentId(1L)).thenReturn(10L);
        when(annotationRepository.countByStudentIdAndTipo(1L, AnnotationType.POSITIVA)).thenReturn(8L);
        when(annotationRepository.countByStudentIdAndTipo(1L, AnnotationType.NEGATIVA)).thenReturn(1L);
        when(annotationRepository.countByStudentIdAndTipo(1L, AnnotationType.NEUTRAL)).thenReturn(1L);
        when(annotationRepository.findByStudentIdAndTipoOrderByFechaDesc(1L, AnnotationType.NEGATIVA))
                .thenReturn(List.of(testAnnotation));

        AnnotationSummaryResponse response = annotationService.getAnnotationSummary(1L);

        assertNotNull(response);
        assertEquals(1L, response.getStudentId());
        assertEquals(10L, response.getTotalAnnotations());
        assertEquals("EXCELENTE", response.getComportamiento());
    }

    @Test
    void getAnnotationSummary_shouldReturnBueno() {
        Annotation leve = new Annotation();
        leve.setGravedad(AnnotationSeverity.LEVE);

        when(annotationRepository.countByStudentId(1L)).thenReturn(10L);
        when(annotationRepository.countByStudentIdAndTipo(1L, AnnotationType.POSITIVA)).thenReturn(5L);
        when(annotationRepository.countByStudentIdAndTipo(1L, AnnotationType.NEGATIVA)).thenReturn(3L);
        when(annotationRepository.countByStudentIdAndTipo(1L, AnnotationType.NEUTRAL)).thenReturn(2L);
        when(annotationRepository.findByStudentIdAndTipoOrderByFechaDesc(1L, AnnotationType.NEGATIVA))
                .thenReturn(List.of(leve, leve, leve));

        AnnotationSummaryResponse response = annotationService.getAnnotationSummary(1L);

        assertNotNull(response);
        assertEquals("BUENO", response.getComportamiento());
    }

    @Test
    void getAnnotationSummary_shouldReturnMaloForMuyGrave() {
        Annotation muyGrave = new Annotation();
        muyGrave.setGravedad(AnnotationSeverity.MUY_GRAVE);

        when(annotationRepository.countByStudentId(1L)).thenReturn(5L);
        when(annotationRepository.countByStudentIdAndTipo(1L, AnnotationType.POSITIVA)).thenReturn(3L);
        when(annotationRepository.countByStudentIdAndTipo(1L, AnnotationType.NEGATIVA)).thenReturn(2L);
        when(annotationRepository.countByStudentIdAndTipo(1L, AnnotationType.NEUTRAL)).thenReturn(0L);
        when(annotationRepository.findByStudentIdAndTipoOrderByFechaDesc(1L, AnnotationType.NEGATIVA))
                .thenReturn(List.of(muyGrave));

        AnnotationSummaryResponse response = annotationService.getAnnotationSummary(1L);

        assertNotNull(response);
        assertEquals("MALO", response.getComportamiento());
    }

    @Test
    void deleteAnnotation_shouldDeleteAnnotation() {
        when(annotationRepository.existsById(1L)).thenReturn(true);
        doNothing().when(annotationRepository).deleteById(1L);

        annotationService.deleteAnnotation(1L);

        verify(annotationRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteAnnotation_shouldThrowWhenNotFound() {
        when(annotationRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> annotationService.deleteAnnotation(99L));
        verify(annotationRepository, never()).deleteById(any());
    }
}
