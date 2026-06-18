package com.bookclass.ms_attendance.repository;

import com.bookclass.ms_attendance.model.entity.Justification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JustificationRepository extends JpaRepository<Justification, Long> {

    // Buscar justificación por ID de asistencia
    Optional<Justification> findByAttendanceId(Long attendanceId);

    // Todas las justificaciones pendientes de aprobación
    List<Justification> findByApprovedOrderByCreatedAtDesc(Boolean approved);

    // Justificaciones aprobadas por un usuario específico
    List<Justification> findByApprovedByOrderByApprovedAtDesc(Long approvedBy);
}
