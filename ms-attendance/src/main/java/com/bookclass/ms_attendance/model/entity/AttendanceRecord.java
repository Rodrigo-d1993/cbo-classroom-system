package com.bookclass.ms_attendance.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records",
    indexes = {
        @Index(name = "idx_student_date", columnList = "student_id, fecha"),
        @Index(name = "idx_fecha", columnList = "fecha"),
        @Index(name = "idx_student", columnList = "student_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_student_fecha", columnNames = {"student_id", "fecha"})
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AttendanceStatus status;

    @Column(length = 500)
    private String observacion;

    @Column(name = "registered_by")
    private Long registeredBy; // ID del usuario que registró (DOCENTE/INSPECTOR)

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
