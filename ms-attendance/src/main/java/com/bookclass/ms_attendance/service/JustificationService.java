package com.bookclass.ms_attendance.service;

import com.bookclass.ms_attendance.dto.request.JustificationRequest;
import com.bookclass.ms_attendance.dto.response.JustificationResponse;

import java.util.List;

public interface JustificationService {

    // Crear justificación
    JustificationResponse createJustification(JustificationRequest request);

    // Aprobar justificación (cambia estado de AUSENTE a JUSTIFICADO)
    JustificationResponse approveJustification(Long id, Long approvedBy);

    // Rechazar justificación
    void rejectJustification(Long id);

    // Obtener justificación por ID
    JustificationResponse getJustificationById(Long id);

    // Obtener justificación por ID de asistencia
    JustificationResponse getJustificationByAttendanceId(Long attendanceId);

    // Obtener todas las justificaciones pendientes
    List<JustificationResponse> getPendingJustifications();

    // Obtener justificaciones aprobadas por un usuario
    List<JustificationResponse> getApprovedByUser(Long userId);
}
