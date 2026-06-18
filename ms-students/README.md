# ms-students - Microservicio de Gestión de Estudiantes

Microservicio de gestión de estudiantes y apoderados para el Sistema de Libro de Clases CBO.

## Funcionalidades

### Estudiantes
- Crear estudiante (ADMIN, DIRECTOR)
- Listar todos los estudiantes (ADMIN, DIRECTOR, DOCENTE, INSPECTOR)
- Ver estudiante por ID (Todos los roles autenticados)
- Buscar por RUT (ADMIN, DIRECTOR, DOCENTE, INSPECTOR)
- Filtrar por curso (ADMIN, DIRECTOR, DOCENTE, INSPECTOR)
- Actualizar estudiante (ADMIN, DIRECTOR)
- Desactivar estudiante (ADMIN, DIRECTOR)

### Apoderados
- Gestión de apoderados asociados a estudiantes
- Relación many-to-many (1 estudiante puede tener N apoderados)

## Modelo de Datos

### Student
```java
- id: Long
- rut: String (único, formato: 12345678-9)
- nombre: String
- apellido: String
- email: String
- fechaNacimiento: LocalDate
- curso: String (ej: "3° Medio A")
- active: boolean
- createdAt: LocalDateTime
- guardians: Set<Guardian>
```

### Guardian (Apoderado)
```java
- id: Long
- rut: String (único)
- nombre: String
- apellido: String
- email: String
- telefono: String
- relacion: String (PADRE, MADRE, etc.)
- active: boolean
- createdAt: LocalDateTime
```

## Endpoints API

### Students

| Método | Endpoint | Descripción | Rol Requerido |
|--------|----------|-------------|---------------|
| POST | /students | Crear estudiante | ADMIN, DIRECTOR |
| GET | /students | Listar todos | ADMIN, DIRECTOR, DOCENTE, INSPECTOR |
| GET | /students/{id} | Ver por ID | Autenticado |
| GET | /students/rut/{rut} | Buscar por RUT | ADMIN, DIRECTOR, DOCENTE, INSPECTOR |
| GET | /students/curso/{curso} | Filtrar por curso | ADMIN, DIRECTOR, DOCENTE, INSPECTOR |
| PUT | /students/{id} | Actualizar | ADMIN, DIRECTOR |
| DELETE | /students/{id} | Desactivar | ADMIN, DIRECTOR |
| POST | /students/{studentId}/guardians/{guardianId} | Asignar apoderado | ADMIN, DIRECTOR |

## Uso Rápido

### 1. Crear un estudiante

```bash
POST http://localhost:8082/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "rut": "20123456-7",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@estudiante.cl",
  "fechaNacimiento": "2008-03-15",
  "curso": "3° Medio A"
}
```

### 2. Listar estudiantes

```bash
GET http://localhost:8082/students
Authorization: Bearer <token>
```

### 3. Buscar por RUT

```bash
GET http://localhost:8082/students/rut/20123456-7
Authorization: Bearer <token>
```

### 4. Filtrar por curso

```bash
GET http://localhost:8082/students/curso/3° Medio A
Authorization: Bearer <token>
```

## Autenticación

Este microservicio valida JWT tokens generados por `ms-auth`. 

**Header requerido:**
```
Authorization: Bearer <jwt-token>
```

## Swagger UI

Documentación interactiva disponible en:
```
http://localhost:8082/swagger-ui.html
```

## Docker

### Build
```bash
docker build -t ms-students .
```

### Run con docker-compose
```bash
docker-compose up ms-students
```

## Base de Datos

- **Motor:** MySQL 8.0
- **Base de datos:** db_students
- **Puerto:** 3306 (interno)
- **Tablas:**
  - students
  - guardians
  - student_guardians (relación)

### Datos de Ejemplo

El script `init.sql` incluye 3 estudiantes y 2 apoderados de ejemplo para testing.

## Configuración

### Variables de Entorno

```env
STUDENTS_DB_NAME=db_students
STUDENTS_DB_USER=students_user
STUDENTS_DB_PASS=<password>
STUDENTS_PORT=8082
JWT_SECRET=<shared-secret>
SPRING_PROFILE=dev
```

### Profiles

- **dev:** DDL auto-update, SQL logging habilitado
- **prod:** DDL validate, logging mínimo, errores ocultos

## Testing

```bash
./mvnw test
```

## Arquitectura

- **Layered Architecture:** Controller → Service → Repository → Database
- **Pattern:** Repository Pattern, DTO Pattern
- **Security:** JWT validation, Role-Based Access Control (RBAC)

## Dependencias Principales

- Spring Boot 3.5.14
- Spring Data JPA
- Spring Security
- MySQL Connector
- JWT (jjwt 0.12.6)
- SpringDoc OpenAPI
- Lombok

## Integración con otros servicios

- **ms-auth:** Valida tokens JWT
- **ms-grades:** (Futuro) Obtiene estudiantes para registrar notas
- **ms-attendance:** (Futuro) Obtiene estudiantes para asistencia

## Notas

- RUT debe tener formato chileno: `12345678-9`
- Estudiantes solo se desactivan, no se borran físicamente
- La relación estudiante-apoderado es many-to-many
- Campo `curso` es texto libre (ej: "3° Medio A", "2° Básico B")

## Troubleshooting

### Error: JWT Invalid
- Verificar que JWT_SECRET es el mismo que en ms-auth
- Verificar que el token no ha expirado

### Error: Connection refused MySQL
- Verificar que db-students está corriendo
- Verificar health check: `docker-compose ps`

### Error: Duplicate RUT
- El RUT ya existe en la base de datos
- Usar endpoint GET /students/rut/{rut} para verificar

---

**Desarrollado por**: Rodrigo Delgadillo y Carolina Celis  
**Asignatura**: Desarrollo Fullstack 3  
**Puerto**: 8082  
**Swagger**: http://localhost:8082/swagger-ui.html  
**Health Check**: http://localhost:8082/actuator/health
