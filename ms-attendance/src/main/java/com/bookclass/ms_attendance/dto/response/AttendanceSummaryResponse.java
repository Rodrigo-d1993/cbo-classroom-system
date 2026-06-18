package com.bookclass.ms_attendance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponse {
    private Long studentId;
    private Long totalDays;
    private Long presentDays;
    private Long absentDays;
    private Long lateDays;
    private Long justifiedDays;
    private BigDecimal attendancePercentage; // Porcentaje de asistencia
    private String status; // "OK" si >= 85%, "AT_RISK" si < 85%, "CRITICAL" si < 70%
}
