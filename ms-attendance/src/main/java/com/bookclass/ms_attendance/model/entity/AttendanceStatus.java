package com.bookclass.ms_attendance.model.entity;

public enum AttendanceStatus {
    PRESENTE,      // Asistió a clases
    AUSENTE,       // No asistió sin justificación
    ATRASADO,      // Llegó tarde
    JUSTIFICADO    // Inasistencia justificada (certificado médico, etc.)
}
