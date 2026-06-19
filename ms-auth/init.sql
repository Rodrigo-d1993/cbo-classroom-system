CREATE DATABASE IF NOT EXISTS db_auth;
USE db_auth;

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT IGNORE INTO roles (name) VALUES
    ('ADMIN_SISTEMA'),
    ('DIRECTOR'),
    ('DOCENTE'),
    ('INSPECTOR'),
    ('APODERADO');

INSERT IGNORE INTO users (username, password, email, active, created_at)
VALUES ('admin', '$2b$12$F4r6WgNNlmgGoGFNzO338.a0bZSUBLzCbzuVFN/7n/hasly0MCvy6', 'admin@cbo.cl', 1, NOW());

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ADMIN_SISTEMA';