package com.bookclass.ms_grades.dto.response;

import com.bookclass.ms_grades.model.entity.GradeType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeResponse {
    private Long id;
    private Long studentId;
    private SubjectResponse subject;
    private BigDecimal nota;
    private GradeType tipo;
    private LocalDate fecha;
    private String observacion;
    private Long teacherId;
    private LocalDateTime createdAt;
}
