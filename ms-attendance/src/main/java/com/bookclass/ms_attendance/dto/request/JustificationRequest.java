package com.bookclass.ms_attendance.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JustificationRequest {

    @NotNull(message = "Attendance ID is required")
    private Long attendanceId;

    @NotBlank(message = "Motivo is required")
    private String motivo;

    private String documentoUrl; // Opcional
}
