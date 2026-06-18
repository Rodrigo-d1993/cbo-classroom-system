package com.bookclass.ms_grades.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubjectRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String nombre;

    @NotBlank(message = "Code is required")
    @Size(min = 2, max = 10, message = "Code must be between 2 and 10 characters")
    @Pattern(regexp = "^[A-Z]{2,10}$", message = "Code must be uppercase letters only")
    private String codigo;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String descripcion;
}
