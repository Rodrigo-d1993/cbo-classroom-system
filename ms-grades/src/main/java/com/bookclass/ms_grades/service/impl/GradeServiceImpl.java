package com.bookclass.ms_grades.service.impl;

import com.bookclass.ms_grades.dto.request.GradeRequest;
import com.bookclass.ms_grades.dto.response.AverageResponse;
import com.bookclass.ms_grades.dto.response.GradeResponse;
import com.bookclass.ms_grades.dto.response.SubjectResponse;
import com.bookclass.ms_grades.exception.ResourceNotFoundException;
import com.bookclass.ms_grades.model.entity.Grade;
import com.bookclass.ms_grades.model.entity.Subject;
import com.bookclass.ms_grades.repository.GradeRepository;
import com.bookclass.ms_grades.repository.SubjectRepository;
import com.bookclass.ms_grades.service.GradeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GradeServiceImpl implements GradeService {

    private final GradeRepository gradeRepository;
    private final SubjectRepository subjectRepository;

    @Override
    @Transactional
    public GradeResponse createGrade(GradeRequest request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + request.getSubjectId()));

        Grade grade = Grade.builder()
                .studentId(request.getStudentId())
                .subject(subject)
                .nota(request.getNota())
                .tipo(request.getTipo())
                .fecha(request.getFecha())
                .observacion(request.getObservacion())
                .build();

        Grade saved = gradeRepository.save(grade);
        log.info("Grade created: {} for student {} in subject {}", 
                 saved.getNota(), saved.getStudentId(), subject.getNombre());

        return mapToResponse(saved);
    }

    @Override
    public GradeResponse getGradeById(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found: " + id));
        return mapToResponse(grade);
    }

    @Override
    public List<GradeResponse> getGradesByStudent(Long studentId) {
        return gradeRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<GradeResponse> getGradesByStudentAndSubject(Long studentId, Long subjectId) {
        return gradeRepository.findByStudentIdAndSubjectId(studentId, subjectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AverageResponse getAverageByStudent(Long studentId) {
        BigDecimal average = gradeRepository.calculateAverageByStudent(studentId);
        Long totalGrades = gradeRepository.countByStudent(studentId);

        if (average == null) {
            average = BigDecimal.ZERO;
        } else {
            // Redondear al decimal más cercano (5.45 → 5.5, 5.44 → 5.4)
            average = average.setScale(1, RoundingMode.HALF_UP);
        }

        return AverageResponse.builder()
                .studentId(studentId)
                .promedio(average)
                .totalGrades(totalGrades)
                .build();
    }

    @Override
    public AverageResponse getAverageByStudentAndSubject(Long studentId, Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));

        BigDecimal average = gradeRepository.calculateAverageByStudentAndSubject(studentId, subjectId);

        if (average == null) {
            average = BigDecimal.ZERO;
        } else {
            average = average.setScale(1, RoundingMode.HALF_UP);
        }

        return AverageResponse.builder()
                .studentId(studentId)
                .subjectId(subjectId)
                .subjectName(subject.getNombre())
                .promedio(average)
                .totalGrades((long) gradeRepository.findByStudentIdAndSubjectId(studentId, subjectId).size())
                .build();
    }

    @Override
    @Transactional
    public GradeResponse updateGrade(Long id, GradeRequest request) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found: " + id));

        grade.setNota(request.getNota());
        grade.setTipo(request.getTipo());
        grade.setFecha(request.getFecha());
        grade.setObservacion(request.getObservacion());

        Grade updated = gradeRepository.save(grade);
        log.info("Grade updated: ID {} to {}", id, updated.getNota());

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteGrade(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found: " + id));
        
        gradeRepository.delete(grade);
        log.info("Grade deleted: ID {}", id);
    }

    private GradeResponse mapToResponse(Grade grade) {
        return GradeResponse.builder()
                .id(grade.getId())
                .studentId(grade.getStudentId())
                .subject(mapSubjectToResponse(grade.getSubject()))
                .nota(grade.getNota())
                .tipo(grade.getTipo())
                .fecha(grade.getFecha())
                .observacion(grade.getObservacion())
                .teacherId(grade.getTeacherId())
                .createdAt(grade.getCreatedAt())
                .build();
    }

    private SubjectResponse mapSubjectToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .nombre(subject.getNombre())
                .codigo(subject.getCodigo())
                .descripcion(subject.getDescripcion())
                .active(subject.isActive())
                .createdAt(subject.getCreatedAt())
                .build();
    }
}
