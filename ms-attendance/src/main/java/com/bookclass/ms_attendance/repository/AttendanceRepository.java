package com.bookclass.ms_attendance.repository;

import com.bookclass.ms_attendance.model.entity.AttendanceRecord;
import com.bookclass.ms_attendance.model.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    // Buscar registro específico por estudiante y fecha
    Optional<AttendanceRecord> findByStudentIdAndFecha(Long studentId, LocalDate fecha);

    // Todos los registros de un estudiante
    List<AttendanceRecord> findByStudentIdOrderByFechaDesc(Long studentId);

    // Registros de un estudiante en un rango de fechas
    List<AttendanceRecord> findByStudentIdAndFechaBetweenOrderByFecha(
            Long studentId, LocalDate startDate, LocalDate endDate);

    // Registros por fecha (para tomar asistencia diaria de todo un curso)
    List<AttendanceRecord> findByFechaOrderByStudentId(LocalDate fecha);

    // Contar registros por estudiante y estado
    Long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    // Contar total de días registrados para un estudiante
    Long countByStudentId(Long studentId);

    // Contar registros por estudiante en rango de fechas
    Long countByStudentIdAndFechaBetween(Long studentId, LocalDate startDate, LocalDate endDate);

    // Contar registros por estudiante, estado y rango de fechas
    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.studentId = :studentId " +
           "AND a.status = :status AND a.fecha BETWEEN :startDate AND :endDate")
    Long countByStudentIdAndStatusAndDateRange(
            @Param("studentId") Long studentId,
            @Param("status") AttendanceStatus status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
