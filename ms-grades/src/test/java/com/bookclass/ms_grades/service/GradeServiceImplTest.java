package com.bookclass.ms_grades.service;

import com.bookclass.ms_grades.dto.request.GradeRequest;
import com.bookclass.ms_grades.dto.response.AverageResponse;
import com.bookclass.ms_grades.dto.response.GradeResponse;
import com.bookclass.ms_grades.exception.ResourceNotFoundException;
import com.bookclass.ms_grades.model.entity.Grade;
import com.bookclass.ms_grades.model.entity.GradeType;
import com.bookclass.ms_grades.model.entity.Subject;
import com.bookclass.ms_grades.repository.GradeRepository;
import com.bookclass.ms_grades.repository.SubjectRepository;
import com.bookclass.ms_grades.service.impl.GradeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class GradeServiceImplTest {

    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @InjectMocks
    private GradeServiceImpl gradeService;

    private Grade testGrade;
    private Subject testSubject;
    private GradeRequest gradeRequest;

    @BeforeEach
    void setUp() {
        testSubject = Subject.builder()
                .id(1L)
                .nombre("Matemáticas")
                .codigo("MAT-101")
                .descripcion("Matemática Básica")
                .active(true)
                .build();

        testGrade = Grade.builder()
                .id(1L)
                .studentId(1L)
                .subject(testSubject)
                .nota(new BigDecimal("6.5"))
                .tipo(GradeType.PRUEBA)
                .fecha(LocalDate.of(2026, 6, 1))
                .observacion("Buen desempeño")
                .teacherId(10L)
                .build();

        gradeRequest = GradeRequest.builder()
                .studentId(1L)
                .subjectId(1L)
                .nota(new BigDecimal("6.5"))
                .tipo(GradeType.PRUEBA)
                .fecha(LocalDate.of(2026, 6, 1))
                .observacion("Buen desempeño")
                .build();
    }

    @Test
    void createGrade_shouldReturnGradeResponse() {
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));
        when(gradeRepository.save(any(Grade.class))).thenReturn(testGrade);

        GradeResponse response = gradeService.createGrade(gradeRequest);

        assertNotNull(response);
        assertEquals(new BigDecimal("6.5"), response.getNota());
        assertEquals(1L, response.getStudentId());
        verify(gradeRepository, times(1)).save(any(Grade.class));
    }

    @Test
    void createGrade_shouldThrowWhenSubjectNotFound() {
        when(subjectRepository.findById(99L)).thenReturn(Optional.empty());
        
        GradeRequest invalidRequest = GradeRequest.builder()
                .studentId(1L)
                .subjectId(99L)
                .nota(new BigDecimal("6.5"))
                .tipo(GradeType.PRUEBA)
                .fecha(LocalDate.of(2026, 6, 1))
                .build();

        assertThrows(ResourceNotFoundException.class, () -> gradeService.createGrade(invalidRequest));
        verify(gradeRepository, never()).save(any(Grade.class));
    }

    @Test
    void getGradeById_shouldReturnGrade() {
        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));

        GradeResponse response = gradeService.getGradeById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(new BigDecimal("6.5"), response.getNota());
    }

    @Test
    void getGradeById_shouldThrowWhenNotFound() {
        when(gradeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> gradeService.getGradeById(99L));
    }

    @Test
    void getGradesByStudent_shouldReturnList() {
        when(gradeRepository.findByStudentId(1L)).thenReturn(List.of(testGrade));

        List<GradeResponse> response = gradeService.getGradesByStudent(1L);

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(1L, response.get(0).getStudentId());
    }

    @Test
    void getGradesByStudentAndSubject_shouldReturnList() {
        when(gradeRepository.findByStudentIdAndSubjectId(1L, 1L)).thenReturn(List.of(testGrade));

        List<GradeResponse> response = gradeService.getGradesByStudentAndSubject(1L, 1L);

        assertNotNull(response);
        assertEquals(1, response.size());
    }

    @Test
    void getAverageByStudent_shouldReturnAverage() {
        when(gradeRepository.calculateAverageByStudent(1L)).thenReturn(new BigDecimal("6.25"));
        when(gradeRepository.countByStudent(1L)).thenReturn(10L);

        AverageResponse response = gradeService.getAverageByStudent(1L);

        assertNotNull(response);
        assertEquals(1L, response.getStudentId());
        assertEquals(new BigDecimal("6.3"), response.getPromedio()); // rounded to 1 decimal
        assertEquals(10L, response.getTotalGrades());
    }

    @Test
    void getAverageByStudent_shouldReturnZeroWhenNoGrades() {
        when(gradeRepository.calculateAverageByStudent(1L)).thenReturn(null);
        when(gradeRepository.countByStudent(1L)).thenReturn(0L);

        AverageResponse response = gradeService.getAverageByStudent(1L);

        assertNotNull(response);
        assertEquals(BigDecimal.ZERO, response.getPromedio());
        assertEquals(0L, response.getTotalGrades());
    }

    @Test
    void getAverageByStudentAndSubject_shouldReturnAverage() {
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(testSubject));
        when(gradeRepository.calculateAverageByStudentAndSubject(1L, 1L)).thenReturn(new BigDecimal("6.45"));
        when(gradeRepository.findByStudentIdAndSubjectId(1L, 1L)).thenReturn(List.of(testGrade));

        AverageResponse response = gradeService.getAverageByStudentAndSubject(1L, 1L);

        assertNotNull(response);
        assertEquals(1L, response.getStudentId());
        assertEquals(1L, response.getSubjectId());
        assertEquals("Matemáticas", response.getSubjectName());
        assertEquals(new BigDecimal("6.5"), response.getPromedio()); // rounded
    }

    @Test
    void getAverageByStudentAndSubject_shouldThrowWhenSubjectNotFound() {
        when(subjectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
                () -> gradeService.getAverageByStudentAndSubject(1L, 99L));
    }

    @Test
    void updateGrade_shouldReturnUpdatedGrade() {
        GradeRequest updateRequest = GradeRequest.builder()
                .studentId(1L)
                .subjectId(1L)
                .nota(new BigDecimal("7.0"))
                .tipo(GradeType.EXAMEN)
                .fecha(LocalDate.of(2026, 6, 15))
                .observacion("Excelente")
                .build();

        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));
        when(gradeRepository.save(any(Grade.class))).thenReturn(testGrade);

        GradeResponse response = gradeService.updateGrade(1L, updateRequest);

        assertNotNull(response);
        verify(gradeRepository, times(1)).save(any(Grade.class));
    }

    @Test
    void updateGrade_shouldThrowWhenNotFound() {
        when(gradeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> gradeService.updateGrade(99L, gradeRequest));
    }

    @Test
    void deleteGrade_shouldDeleteGrade() {
        when(gradeRepository.findById(1L)).thenReturn(Optional.of(testGrade));
        doNothing().when(gradeRepository).delete(testGrade);

        gradeService.deleteGrade(1L);

        verify(gradeRepository, times(1)).delete(testGrade);
    }

    @Test
    void deleteGrade_shouldThrowWhenNotFound() {
        when(gradeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> gradeService.deleteGrade(99L));
        verify(gradeRepository, never()).delete(any(Grade.class));
    }
}
