package com.bookclass.ms_grades.dto.request;

import com.bookclass.ms_grades.model.entity.GradeType;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GradeRequest {

    @NotNull(message = "Student ID is required")
    @Positive(message = "Student ID must be positive")
    private Long studentId;

    @NotNull(message = "Subject ID is required")
    @Positive(message = "Subject ID must be positive")
    private Long subjectId;

    @NotNull(message = "Grade is required")
    @DecimalMin(value = "1.0", message = "Grade must be at least 1.0")
    @DecimalMax(value = "7.0", message = "Grade must not exceed 7.0")
    @Digits(integer = 1, fraction = 1, message = "Grade must have format X.X")
    private BigDecimal nota;

    @NotNull(message = "Grade type is required")
    private GradeType tipo;

    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Date cannot be in the future")
    private LocalDate fecha;

    @Size(max = 500, message = "Observation must not exceed 500 characters")
    private String observacion;
}
