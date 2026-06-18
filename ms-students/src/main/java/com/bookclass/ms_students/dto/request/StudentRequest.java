package com.bookclass.ms_students.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {

    @NotBlank(message = "RUT is required")
    @Pattern(regexp = "^[0-9]{7,8}-[0-9Kk]$", message = "RUT format invalid (ej: 12345678-9)")
    private String rut;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String nombre;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String apellido;

    @Email(message = "Email is not valid")
    @Size(max = 150)
    private String email;

    @Past(message = "Birth date must be in the past")
    private LocalDate fechaNacimiento;

    @Size(max = 50, message = "Course must not exceed 50 characters")
    private String curso;
}
