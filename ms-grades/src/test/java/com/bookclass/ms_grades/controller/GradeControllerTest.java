package com.bookclass.ms_grades.controller;

import com.bookclass.ms_grades.dto.request.GradeRequest;
import com.bookclass.ms_grades.dto.response.AverageResponse;
import com.bookclass.ms_grades.dto.response.GradeResponse;
import com.bookclass.ms_grades.dto.response.SubjectResponse;
import com.bookclass.ms_grades.model.entity.GradeType;
import com.bookclass.ms_grades.service.GradeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class GradeControllerTest {

    @Mock
    private GradeService gradeService;

    @InjectMocks
    private GradeController gradeController;

    private GradeResponse gradeResponse;
    private GradeRequest gradeRequest;
    private AverageResponse averageResponse;

    @BeforeEach
    void setUp() {
        SubjectResponse subject = SubjectResponse.builder()
                .id(1L)
                .nombre("Matemáticas")
                .codigo("MAT-101")
                .active(true)
                .build();

        gradeResponse = GradeResponse.builder()
                .id(1L)
                .studentId(1L)
                .subject(subject)
                .nota(new BigDecimal("6.5"))
                .tipo(GradeType.PRUEBA)
                .fecha(LocalDate.of(2026, 6, 1))
                .observacion("Buen desempeño")
                .build();

        gradeRequest = GradeRequest.builder()
                .studentId(1L)
                .subjectId(1L)
                .nota(new BigDecimal("6.5"))
                .tipo(GradeType.PRUEBA)
                .fecha(LocalDate.of(2026, 6, 1))
                .observacion("Buen desempeño")
                .build();

        averageResponse = AverageResponse.builder()
                .studentId(1L)
                .promedio(new BigDecimal("6.2"))
                .totalGrades(10L)
                .build();
    }

    @Test
    void createGrade_shouldReturn201() {
        when(gradeService.createGrade(any(GradeRequest.class))).thenReturn(gradeResponse);

        ResponseEntity<GradeResponse> response = gradeController.createGrade(gradeRequest);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(new BigDecimal("6.5"), response.getBody().getNota());
    }

    @Test
    void getGradeById_shouldReturn200() {
        when(gradeService.getGradeById(1L)).thenReturn(gradeResponse);

        ResponseEntity<GradeResponse> response = gradeController.getGradeById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void getGradesByStudent_shouldReturn200() {
        when(gradeService.getGradesByStudent(1L)).thenReturn(List.of(gradeResponse));

        ResponseEntity<List<GradeResponse>> response = gradeController.getGradesByStudent(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getGradesByStudentAndSubject_shouldReturn200() {
        when(gradeService.getGradesByStudentAndSubject(1L, 1L)).thenReturn(List.of(gradeResponse));

        ResponseEntity<List<GradeResponse>> response = gradeController.getGradesByStudentAndSubject(1L, 1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getAverageByStudent_shouldReturn200() {
        when(gradeService.getAverageByStudent(1L)).thenReturn(averageResponse);

        ResponseEntity<AverageResponse> response = gradeController.getAverageByStudent(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(new BigDecimal("6.2"), response.getBody().getPromedio());
    }

    @Test
    void getAverageByStudentAndSubject_shouldReturn200() {
        when(gradeService.getAverageByStudentAndSubject(1L, 1L)).thenReturn(averageResponse);

        ResponseEntity<AverageResponse> response = gradeController.getAverageByStudentAndSubject(1L, 1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(new BigDecimal("6.2"), response.getBody().getPromedio());
    }

    @Test
    void updateGrade_shouldReturn200() {
        when(gradeService.updateGrade(eq(1L), any(GradeRequest.class))).thenReturn(gradeResponse);

        ResponseEntity<GradeResponse> response = gradeController.updateGrade(1L, gradeRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void deleteGrade_shouldReturn204() {
        doNothing().when(gradeService).deleteGrade(1L);

        ResponseEntity<Void> response = gradeController.deleteGrade(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(gradeService, times(1)).deleteGrade(1L);
    }
}
