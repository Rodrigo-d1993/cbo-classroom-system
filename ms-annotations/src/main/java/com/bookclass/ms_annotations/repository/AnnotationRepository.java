package com.bookclass.ms_annotations.repository;

import com.bookclass.ms_annotations.model.entity.Annotation;
import com.bookclass.ms_annotations.model.entity.AnnotationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AnnotationRepository extends JpaRepository<Annotation, Long> {

    // Todas las anotaciones de un estudiante ordenadas por fecha
    List<Annotation> findByStudentIdOrderByFechaDesc(Long studentId);

    // Anotaciones de un estudiante por tipo
    List<Annotation> findByStudentIdAndTipoOrderByFechaDesc(Long studentId, AnnotationType tipo);

    // Anotaciones registradas por un profesor
    List<Annotation> findByTeacherIdOrderByFechaDesc(Long teacherId);

    // Anotaciones de un estudiante en un rango de fechas
    List<Annotation> findByStudentIdAndFechaBetweenOrderByFecha(
            Long studentId, LocalDate startDate, LocalDate endDate);

    // Contar anotaciones por estudiante y tipo
    Long countByStudentIdAndTipo(Long studentId, AnnotationType tipo);

    // Total de anotaciones de un estudiante
    Long countByStudentId(Long studentId);

    // Anotaciones por categoría
    List<Annotation> findByCategoriaOrderByFechaDesc(String categoria);

    // Anotaciones de un profesor para un estudiante específico
    List<Annotation> findByTeacherIdAndStudentIdOrderByFechaDesc(Long teacherId, Long studentId);
}
