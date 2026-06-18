package com.bookclass.ms_attendance.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "justifications",
    indexes = {
        @Index(name = "idx_attendance", columnList = "attendance_id"),
        @Index(name = "idx_approved", columnList = "approved")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Justification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attendance_id", nullable = false)
    private Long attendanceId;

    @Column(nullable = false, length = 1000)
    private String motivo;

    @Column(name = "documento_url", length = 500)
    private String documentoUrl; // URL del certificado médico u otro documento

    @Column(nullable = false)
    private Boolean approved = false;

    @Column(name = "approved_by")
    private Long approvedBy; // ID del usuario que aprobó (DIRECTOR/INSPECTOR)

    @Column(name = "approved_at")
    private LocalDate approvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
