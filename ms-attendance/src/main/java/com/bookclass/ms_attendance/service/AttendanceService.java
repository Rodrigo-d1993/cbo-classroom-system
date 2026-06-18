package com.bookclass.ms_attendance.service;

import com.bookclass.ms_attendance.dto.request.AttendanceRequest;
import com.bookclass.ms_attendance.dto.response.AttendanceResponse;
import com.bookclass.ms_attendance.dto.response.AttendanceSummaryResponse;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    // Registrar asistencia
    AttendanceResponse recordAttendance(AttendanceRequest request);

    // Actualizar registro de asistencia
    AttendanceResponse updateAttendance(Long id, AttendanceRequest request);

    // Obtener registro por ID
    AttendanceResponse getAttendanceById(Long id);

    // Obtener todos los registros de un estudiante
    List<AttendanceResponse> getAttendanceByStudent(Long studentId);

    // Obtener registros de un estudiante en rango de fechas
    List<AttendanceResponse> getAttendanceByStudentAndDateRange(
            Long studentId, LocalDate startDate, LocalDate endDate);

    // Obtener asistencia de una fecha específica (todo el curso)
    List<AttendanceResponse> getAttendanceByDate(LocalDate fecha);

    // Obtener resumen de asistencia de un estudiante
    AttendanceSummaryResponse getAttendanceSummary(Long studentId);

    // Obtener resumen en rango de fechas
    AttendanceSummaryResponse getAttendanceSummaryByDateRange(
            Long studentId, LocalDate startDate, LocalDate endDate);

    // Eliminar registro
    void deleteAttendance(Long id);
}
