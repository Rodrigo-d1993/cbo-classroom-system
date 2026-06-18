package com.bookclass.ms_grades.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AverageResponse {
    private Long studentId;
    private Long subjectId;
    private String subjectName;
    private BigDecimal promedio;
    private Long totalGrades;
    private String situacion; // APROBADO, REPROBADO, INSUFICIENTE
    
    // Calcular situación basada en promedio
    public String getSituacion() {
        if (promedio == null) return "SIN NOTAS";
        if (promedio.compareTo(BigDecimal.valueOf(4.0)) >= 0) {
            return "APROBADO";
        } else {
            return "REPROBADO";
        }
    }
}
