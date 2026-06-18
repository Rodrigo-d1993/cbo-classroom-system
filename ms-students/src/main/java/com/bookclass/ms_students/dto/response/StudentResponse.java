package com.bookclass.ms_students.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {
    private Long id;
    private String rut;
    private String nombre;
    private String apellido;
    private String email;
    private LocalDate fechaNacimiento;
    private String curso;
    private boolean active;
    private LocalDateTime createdAt;
    private Set<GuardianResponse> guardians;
}
