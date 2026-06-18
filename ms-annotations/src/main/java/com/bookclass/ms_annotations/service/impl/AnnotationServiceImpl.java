package com.bookclass.ms_annotations.service.impl;

import com.bookclass.ms_annotations.dto.request.AnnotationRequest;
import com.bookclass.ms_annotations.dto.response.AnnotationResponse;
import com.bookclass.ms_annotations.dto.response.AnnotationSummaryResponse;
import com.bookclass.ms_annotations.exception.ResourceNotFoundException;
import com.bookclass.ms_annotations.model.entity.Annotation;
import com.bookclass.ms_annotations.model.entity.AnnotationSeverity;
import com.bookclass.ms_annotations.model.entity.AnnotationType;
import com.bookclass.ms_annotations.repository.AnnotationRepository;
import com.bookclass.ms_annotations.service.AnnotationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnnotationServiceImpl implements AnnotationService {

    private final AnnotationRepository annotationRepository;

    @Override
    @Transactional
    public AnnotationResponse createAnnotation(AnnotationRequest request) {
        // Validar regla de negocio: gravedad solo para anotaciones negativas
        validateGravedadRule(request.getTipo(), request.getGravedad());

        Annotation annotation = new Annotation();
        annotation.setStudentId(request.getStudentId());
        annotation.setTeacherId(request.getTeacherId());
        annotation.setTipo(request.getTipo());
        annotation.setCategoria(request.getCategoria());
        annotation.setDescripcion(request.getDescripcion());
        annotation.setFecha(request.getFecha());
        annotation.setGravedad(request.getGravedad());

        Annotation saved = annotationRepository.save(annotation);
        log.info("Annotation created: id={}, studentId={}, tipo={}", 
                saved.getId(), saved.getStudentId(), saved.getTipo());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public AnnotationResponse updateAnnotation(Long id, AnnotationRequest request) {
        Annotation annotation = annotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annotation not found with id: " + id));

        // Validar regla de negocio
        validateGravedadRule(request.getTipo(), request.getGravedad());

        annotation.setTipo(request.getTipo());
        annotation.setCategoria(request.getCategoria());
        annotation.setDescripcion(request.getDescripcion());
        annotation.setFecha(request.getFecha());
        annotation.setGravedad(request.getGravedad());

        Annotation updated = annotationRepository.save(annotation);
        log.info("Annotation updated: id={}", id);

        return mapToResponse(updated);
    }

    @Override
    public AnnotationResponse getAnnotationById(Long id) {
        Annotation annotation = annotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annotation not found with id: " + id));
        return mapToResponse(annotation);
    }

    @Override
    public List<AnnotationResponse> getAnnotationsByStudent(Long studentId) {
        return annotationRepository.findByStudentIdOrderByFechaDesc(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnotationResponse> getAnnotationsByStudentAndType(Long studentId, AnnotationType tipo) {
        return annotationRepository.findByStudentIdAndTipoOrderByFechaDesc(studentId, tipo)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnotationResponse> getAnnotationsByStudentAndDateRange(
            Long studentId, LocalDate startDate, LocalDate endDate) {
        return annotationRepository.findByStudentIdAndFechaBetweenOrderByFecha(studentId, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnotationResponse> getAnnotationsByTeacher(Long teacherId) {
        return annotationRepository.findByTeacherIdOrderByFechaDesc(teacherId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AnnotationSummaryResponse getAnnotationSummary(Long studentId) {
        Long totalCount = annotationRepository.countByStudentId(studentId);
        Long positiveCount = annotationRepository.countByStudentIdAndTipo(studentId, AnnotationType.POSITIVA);
        Long negativeCount = annotationRepository.countByStudentIdAndTipo(studentId, AnnotationType.NEGATIVA);
        Long neutralCount = annotationRepository.countByStudentIdAndTipo(studentId, AnnotationType.NEUTRAL);

        // Contar por gravedad (solo en negativas)
        List<Annotation> negativeAnnotations = annotationRepository
                .findByStudentIdAndTipoOrderByFechaDesc(studentId, AnnotationType.NEGATIVA);
        
        long leveCount = negativeAnnotations.stream()
                .filter(a -> a.getGravedad() == AnnotationSeverity.LEVE)
                .count();
        long graveCount = negativeAnnotations.stream()
                .filter(a -> a.getGravedad() == AnnotationSeverity.GRAVE)
                .count();
        long muyGraveCount = negativeAnnotations.stream()
                .filter(a -> a.getGravedad() == AnnotationSeverity.MUY_GRAVE)
                .count();

        // Calcular comportamiento general
        String comportamiento = calculateComportamiento(positiveCount, negativeCount, graveCount, muyGraveCount);

        return AnnotationSummaryResponse.builder()
                .studentId(studentId)
                .totalAnnotations(totalCount)
                .positiveCount(positiveCount)
                .negativeCount(negativeCount)
                .neutralCount(neutralCount)
                .leveCount(leveCount)
                .graveCount(graveCount)
                .muyGraveCount(muyGraveCount)
                .comportamiento(comportamiento)
                .build();
    }

    @Override
    @Transactional
    public void deleteAnnotation(Long id) {
        if (!annotationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Annotation not found with id: " + id);
        }
        annotationRepository.deleteById(id);
        log.info("Annotation deleted: id={}", id);
    }

    private void validateGravedadRule(AnnotationType tipo, AnnotationSeverity gravedad) {
        if (tipo != AnnotationType.NEGATIVA && gravedad != null) {
            throw new IllegalArgumentException(
                    "Gravedad solo puede ser especificada para anotaciones de tipo NEGATIVA");
        }
        if (tipo == AnnotationType.NEGATIVA && gravedad == null) {
            throw new IllegalArgumentException(
                    "Gravedad es obligatoria para anotaciones de tipo NEGATIVA");
        }
    }

    private String calculateComportamiento(Long positive, Long negative, Long grave, Long muyGrave) {
        // Lógica simple de cálculo de comportamiento
        // Positivas suman, negativas restan, graves pesan más
        
        if (muyGrave > 0) {
            return "MALO"; // Cualquier falta muy grave es crítica
        }
        
        long balance = positive - negative - (grave * 2);
        
        if (balance >= 3) {
            return "EXCELENTE";
        } else if (balance >= 0) {
            return "BUENO";
        } else if (balance >= -3) {
            return "REGULAR";
        } else {
            return "MALO";
        }
    }

    private AnnotationResponse mapToResponse(Annotation annotation) {
        return AnnotationResponse.builder()
                .id(annotation.getId())
                .studentId(annotation.getStudentId())
                .teacherId(annotation.getTeacherId())
                .tipo(annotation.getTipo())
                .categoria(annotation.getCategoria())
                .descripcion(annotation.getDescripcion())
                .fecha(annotation.getFecha())
                .gravedad(annotation.getGravedad())
                .createdAt(annotation.getCreatedAt())
                .updatedAt(annotation.getUpdatedAt())
                .build();
    }
}
