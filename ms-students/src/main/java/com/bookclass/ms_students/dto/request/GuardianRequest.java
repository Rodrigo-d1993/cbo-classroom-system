package com.bookclass.ms_students.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GuardianRequest {

    @NotBlank(message = "RUT is required")
    @Pattern(regexp = "^[0-9]{7,8}-[0-9Kk]$", message = "RUT format invalid")
    private String rut;

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String nombre;

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    private String apellido;

    @Email(message = "Email is not valid")
    @Size(max = 150)
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "Phone format invalid")
    private String telefono;

    @Size(max = 50)
    private String relacion; // PADRE, MADRE, etc.
}
