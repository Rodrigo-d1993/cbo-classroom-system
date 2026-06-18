CREATE DATABASE IF NOT EXISTS db_attendance;
USE db_attendance;

-- Tabla de registros de asistencia
CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    observacion VARCHAR(500),
    registered_by BIGINT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    UNIQUE KEY uk_student_fecha (student_id, fecha),
    INDEX idx_student_date (student_id, fecha),
    INDEX idx_fecha (fecha),
    INDEX idx_student (student_id)
);

-- Tabla de justificaciones
CREATE TABLE IF NOT EXISTS justifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    attendance_id BIGINT NOT NULL,
    motivo VARCHAR(1000) NOT NULL,
    documento_url VARCHAR(500),
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by BIGINT,
    approved_at DATE,
    created_at DATETIME NOT NULL,
    INDEX idx_attendance (attendance_id),
    INDEX idx_approved (approved),
    FOREIGN KEY (attendance_id) REFERENCES attendance_records(id) ON DELETE CASCADE
);

-- Datos de ejemplo: Asistencia de marzo 2024 para estudiante id=1
INSERT IGNORE INTO attendance_records (id, student_id, fecha, status, observacion, created_at, updated_at) VALUES
(1, 1, '2024-03-01', 'PRESENTE', NULL, NOW(), NOW()),
(2, 1, '2024-03-04', 'PRESENTE', NULL, NOW(), NOW()),
(3, 1, '2024-03-05', 'ATRASADO', 'Llegó 15 minutos tarde', NOW(), NOW()),
(4, 1, '2024-03-06', 'PRESENTE', NULL, NOW(), NOW()),
(5, 1, '2024-03-07', 'AUSENTE', NULL, NOW(), NOW()),
(6, 1, '2024-03-08', 'PRESENTE', NULL, NOW(), NOW()),
(7, 1, '2024-03-11', 'PRESENTE', NULL, NOW(), NOW()),
(8, 1, '2024-03-12', 'AUSENTE', NULL, NOW(), NOW()),
(9, 1, '2024-03-13', 'PRESENTE', NULL, NOW(), NOW()),
(10, 1, '2024-03-14', 'PRESENTE', NULL, NOW(), NOW());

-- Datos de ejemplo: Justificación para ausencia del 2024-03-07
INSERT IGNORE INTO justifications (id, attendance_id, motivo, documento_url, approved, created_at) VALUES
(1, 5, 'Certificado médico - Gripe', 'https://example.com/certificado-medico-001.pdf', FALSE, NOW());

-- Resumen del ejemplo:
-- Estudiante id=1 tiene 10 días registrados en marzo 2024:
-- - 7 días PRESENTE
-- - 1 día ATRASADO (cuenta como presente)
-- - 2 días AUSENTE (uno con justificación pendiente)
-- Porcentaje actual: 80% (8/10)
-- Estado: AT_RISK (necesita 85% mínimo)
