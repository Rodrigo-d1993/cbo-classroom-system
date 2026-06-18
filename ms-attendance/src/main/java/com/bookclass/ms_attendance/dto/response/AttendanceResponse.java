package com.bookclass.ms_attendance.dto.response;

import com.bookclass.ms_attendance.model.entity.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private LocalDate fecha;
    private AttendanceStatus status;
    private String observacion;
    private Long registeredBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
