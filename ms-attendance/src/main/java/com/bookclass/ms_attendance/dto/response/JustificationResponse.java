package com.bookclass.ms_attendance.dto.response;

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
public class JustificationResponse {
    private Long id;
    private Long attendanceId;
    private String motivo;
    private String documentoUrl;
    private Boolean approved;
    private Long approvedBy;
    private LocalDate approvedAt;
    private LocalDateTime createdAt;
}
