CREATE DATABASE IF NOT EXISTS db_students;
USE db_students;

CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    fecha_nacimiento DATE,
    curso VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS guardians (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    telefono VARCHAR(20),
    relacion VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS student_guardians (
    student_id BIGINT NOT NULL,
    guardian_id BIGINT NOT NULL,
    PRIMARY KEY (student_id, guardian_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (guardian_id) REFERENCES guardians(id) ON DELETE CASCADE
);

-- Datos de ejemplo
INSERT IGNORE INTO students (id, rut, nombre, apellido, email, fecha_nacimiento, curso, created_at) VALUES
(1, '20123456-7', 'Juan', 'Pérez', 'juan.perez@estudiante.cl', '2008-03-15', '3° Medio A', NOW()),
(2, '20234567-8', 'María', 'González', 'maria.gonzalez@estudiante.cl', '2008-07-22', '3° Medio A', NOW()),
(3, '20345678-9', 'Pedro', 'Silva', 'pedro.silva@estudiante.cl', '2009-11-10', '2° Medio B', NOW());

INSERT IGNORE INTO guardians (id, rut, nombre, apellido, email, telefono, relacion, created_at) VALUES
(1, '12345678-9', 'Carlos', 'Pérez', 'carlos.perez@email.cl', '+56912345678', 'PADRE', NOW()),
(2, '23456789-0', 'Ana', 'González', 'ana.gonzalez@email.cl', '+56923456789', 'MADRE', NOW());

INSERT IGNORE INTO student_guardians (student_id, guardian_id) VALUES
(1, 1),
(2, 2);
