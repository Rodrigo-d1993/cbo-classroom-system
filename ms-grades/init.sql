CREATE DATABASE IF NOT EXISTS db_grades;
USE db_grades;

-- Tabla de asignaturas
CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME
);

-- Tabla de notas
CREATE TABLE IF NOT EXISTS grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    nota DECIMAL(3,1) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    observacion VARCHAR(500),
    teacher_id BIGINT,
    created_at DATETIME,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    CHECK (nota >= 1.0 AND nota <= 7.0)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_subject ON grades(subject_id);
CREATE INDEX idx_grades_fecha ON grades(fecha);

-- Datos de ejemplo: Asignaturas típicas de enseñanza media chilena
INSERT IGNORE INTO subjects (id, nombre, codigo, descripcion, created_at) VALUES
(1, 'Matemática', 'MAT', 'Matemática general', NOW()),
(2, 'Lenguaje y Comunicación', 'LEN', 'Lenguaje y literatura', NOW()),
(3, 'Historia y Geografía', 'HIS', 'Historia, geografía y ciencias sociales', NOW()),
(4, 'Ciencias Naturales', 'CIE', 'Biología, química y física', NOW()),
(5, 'Inglés', 'ING', 'Idioma inglés', NOW()),
(6, 'Educación Física', 'EFI', 'Educación física y salud', NOW()),
(7, 'Artes Visuales', 'ART', 'Artes visuales', NOW()),
(8, 'Música', 'MUS', 'Educación musical', NOW());

-- Datos de ejemplo: Algunas notas para el estudiante con id=1
INSERT IGNORE INTO grades (id, student_id, subject_id, nota, tipo, fecha, observacion, created_at) VALUES
(1, 1, 1, 6.5, 'PRUEBA', '2024-03-15', 'Prueba de funciones', NOW()),
(2, 1, 1, 5.8, 'TRABAJO', '2024-03-22', 'Trabajo grupal', NOW()),
(3, 1, 2, 6.2, 'PRUEBA', '2024-03-18', 'Comprensión lectora', NOW()),
(4, 1, 2, 6.8, 'EXAMEN', '2024-03-25', 'Examen parcial', NOW()),
(5, 1, 3, 5.5, 'PRUEBA', '2024-03-20', 'Historia de Chile', NOW());
