# CBO Classroom System

Sistema de gestión escolar basado en microservicios para establecimientos educacionales chilenos.

## Descripción

Plataforma para administración escolar que cubre:

- Calificaciones en escala 1.0 a 7.0
- Control de asistencia (mínimo 85% requerido)
- Gestión de estudiantes con formato RUT chileno
- Apoderados y tutores legales
- Anotaciones disciplinarias y de comportamiento
- Control de acceso por roles (RBAC)

## Arquitectura

Microservicios con comunicación REST, autenticación JWT y base de datos MySQL independiente por servicio.

### Microservicios

| Microservicio | Puerto | Responsabilidad |
|--------------|--------|-----------------|
| ms-auth | 8081 | Autenticación y gestión de usuarios/roles |
| ms-students | 8082 | Gestión de estudiantes y apoderados |
| ms-grades | 8083 | Calificaciones (escala 1.0–7.0) |
| ms-attendance | 8084 | Control de asistencia |
| ms-annotations | 8085 | Anotaciones disciplinarias |

## Stack Tecnológico

- Java 17 + Spring Boot 3.5.14
- MySQL 8.0
- Docker y Docker Compose
- JWT (autenticación)
- Maven

## Instalación

### Requisitos

- Java 17+
- Docker y Docker Compose
- Git

### Pasos

1. Clonar el repositorio:

```bash
git clone https://github.com/Rodrigo-d1993/cbo-classroom-system.git
cd cbo-classroom-system
```

2. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus valores
```

3. Levantar los servicios:

```bash
docker-compose up -d
```

4. Verificar que todo esté corriendo:

```bash
curl http://localhost:8081/actuator/health
```

## Uso

### Login

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cbo.cl","password":"Admin123!"}'
```

### Documentación API

Cada microservicio expone Swagger UI en `/swagger-ui.html`. Por ejemplo:

```
http://localhost:8081/swagger-ui.html
```

## Roles y Permisos

| Rol | Descripción |
|-----|-------------|
| `ADMIN_SISTEMA` | Control total del sistema |
| `DIRECTOR` | Gestión completa del establecimiento |
| `INSPECTOR` | Control de asistencia y disciplina |
| `DOCENTE` | Registro de notas y asistencia |
| `APODERADO` | Consulta información de sus pupilos |
| `ESTUDIANTE` | Consulta su propia información |

## Estructura del Proyecto

```
cbo-classroom-system/
├── ms-auth/
├── ms-students/
├── ms-grades/
├── ms-attendance/
├── ms-annotations/
├── docker-compose.yml
└── .env.example
```

## Desarrollo Local

Para correr un microservicio individualmente:

```bash
cd ms-{nombre}
./mvnw spring-boot:run
```

Otros comandos útiles:

```bash
./mvnw clean package   # compilar
./mvnw test            # ejecutar tests
```

## Comandos Docker

```bash
docker-compose up -d              # levantar todos los servicios
docker-compose logs -f ms-auth    # ver logs de un servicio
docker-compose restart ms-auth    # reiniciar un servicio
docker-compose down               # detener todo
```

## Consideraciones de Seguridad

- No subir el archivo `.env` al repositorio
- El `JWT_SECRET` debe tener mínimo 256 bits
- Usar HTTPS en producción

## Autores

Rodrigo Delgadillo y Carolina Celis  
Desarrollo Fullstack III — Duoc UC, 2026