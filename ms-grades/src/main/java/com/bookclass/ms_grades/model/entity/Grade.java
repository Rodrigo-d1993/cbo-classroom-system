package com.bookclass.ms_grades.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "grades", indexes = {
    @Index(name = "idx_grades_student", columnList = "student_id"),
    @Index(name = "idx_grades_subject", columnList = "subject_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId; // Referencia a ms-students

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal nota; // 1.0 a 7.0

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private GradeType tipo;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 500)
    private String observacion;

    @Column(name = "teacher_id")
    private Long teacherId; // Referencia a ms-auth (usuario docente)

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Validación de nota en rango chileno
    public void setNota(BigDecimal nota) {
        if (nota.compareTo(BigDecimal.valueOf(1.0)) < 0 || 
            nota.compareTo(BigDecimal.valueOf(7.0)) > 0) {
            throw new IllegalArgumentException("Grade must be between 1.0 and 7.0");
        }
        this.nota = nota;
    }
}
