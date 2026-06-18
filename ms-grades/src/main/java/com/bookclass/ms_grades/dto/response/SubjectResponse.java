package com.bookclass.ms_grades.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectResponse {
    private Long id;
    private String nombre;
    private String codigo;
    private String descripcion;
    private boolean active;
    private LocalDateTime createdAt;
}
