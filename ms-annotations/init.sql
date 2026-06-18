CREATE DATABASE IF NOT EXISTS db_annotations;
USE db_annotations;

-- Tabla de anotaciones
CREATE TABLE IF NOT EXISTS annotations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    fecha DATE NOT NULL,
    gravedad VARCHAR(20),
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    INDEX idx_student (student_id),
    INDEX idx_teacher (teacher_id),
    INDEX idx_fecha (fecha),
    INDEX idx_tipo (tipo),
    INDEX idx_student_tipo (student_id, tipo)
);

-- Datos de ejemplo: Anotaciones de marzo 2024 para diferentes estudiantes

-- Anotaciones POSITIVAS para estudiante id=1
INSERT IGNORE INTO annotations (id, student_id, teacher_id, tipo, categoria, descripcion, fecha, gravedad, created_at, updated_at) VALUES
(1, 1, 5, 'POSITIVA', 'PARTICIPACION', 'Excelente participación en clase de matemáticas. Resolvió ejercicios complejos en la pizarra.', '2024-03-15', NULL, NOW(), NOW()),
(2, 1, 6, 'POSITIVA', 'RESPONSABILIDAD', 'Entregó trabajo de investigación antes del plazo establecido con contenido de calidad.', '2024-03-18', NULL, NOW(), NOW()),
(3, 1, 5, 'POSITIVA', 'COLABORACION', 'Ayudó a compañeros con dificultades en álgebra durante trabajo grupal.', '2024-03-20', NULL, NOW(), NOW());

-- Anotaciones NEGATIVAS para estudiante id=2
INSERT IGNORE INTO annotations (id, student_id, teacher_id, tipo, categoria, descripcion, fecha, gravedad, created_at, updated_at) VALUES
(4, 2, 6, 'NEGATIVA', 'CONDUCTA', 'Interrumpió constantemente la clase conversando con compañeros.', '2024-03-14', 'LEVE', NOW(), NOW()),
(5, 2, 7, 'NEGATIVA', 'RESPONSABILIDAD', 'No trajo materiales requeridos para la clase práctica de ciencias.', '2024-03-16', 'LEVE', NOW(), NOW()),
(6, 2, 5, 'NEGATIVA', 'CONDUCTA', 'Falta de respeto hacia compañero durante debate en clase.', '2024-03-22', 'GRAVE', NOW(), NOW());

-- Anotaciones NEUTRALES
INSERT IGNORE INTO annotations (id, student_id, teacher_id, tipo, categoria, descripcion, fecha, gravedad, created_at, updated_at) VALUES
(7, 1, 5, 'NEUTRAL', 'GENERAL', 'Estudiante mostró mejoría progresiva en matemáticas durante el mes.', '2024-03-25', NULL, NOW(), NOW()),
(8, 3, 6, 'NEUTRAL', 'OBSERVACION', 'Se observa que el estudiante requiere apoyo adicional en comprensión lectora.', '2024-03-19', NULL, NOW(), NOW());

-- Anotación MUY_GRAVE (ejemplo)
INSERT IGNORE INTO annotations (id, student_id, teacher_id, tipo, categoria, descripcion, fecha, gravedad, created_at, updated_at) VALUES
(9, 4, 7, 'NEGATIVA', 'CONDUCTA', 'Intento de copia durante evaluación sumativa de historia.', '2024-03-21', 'MUY_GRAVE', NOW(), NOW());

-- Resumen del ejemplo:
-- Estudiante id=1: 3 POSITIVAS, 0 NEGATIVAS → Comportamiento EXCELENTE
-- Estudiante id=2: 0 POSITIVAS, 3 NEGATIVAS (2 LEVE, 1 GRAVE) → Comportamiento MALO
-- Estudiante id=3: 0 POSITIVAS, 0 NEGATIVAS, 1 NEUTRAL → Sin evaluación conductual
-- Estudiante id=4: 0 POSITIVAS, 1 NEGATIVA (MUY_GRAVE) → Comportamiento MALO
