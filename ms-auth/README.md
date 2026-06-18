# ms-auth - Servicio de Autenticación

Microservicio de autenticación y gestión de usuarios para CBO Classroom System.

## Tecnologías

- Spring Boot 3.5.14
- Java 17
- MySQL 8.0
- JWT para autenticación

## Endpoints Principales

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/users` - Listar usuarios (requiere autenticación)
- `GET /api/auth/users/{id}` - Obtener usuario por ID
- `GET /api/auth/users/me` - Obtener perfil del usuario autenticado

## Variables de Entorno

```env
AUTH_DB_NAME=db_auth
AUTH_DB_USER=auth_user
AUTH_DB_PASS=<password>
JWT_SECRET=<secret-256-bits>
JWT_EXPIRATION_MS=86400000
AUTH_PORT=8081
```

## Compilación y Ejecución

```bash
# Compilar
./mvnw clean package

# Ejecutar tests
./mvnw test

# Ejecutar con Docker
docker-compose up ms-auth
```

## Roles del Sistema

- ADMIN_SISTEMA - Control total
- DIRECTOR - Gestión del establecimiento
- INSPECTOR - Control de asistencia y disciplina
- DOCENTE - Registro de notas y asistencia
- APODERADO - Consulta información de pupilos
- ESTUDIANTE - Consulta propia información

## Notas de Seguridad

- JWT_SECRET debe tener mínimo 256 bits
- No commitear el archivo .env al repositorio
- Implementar rate limiting en producción
- Usar HTTPS en producción

## Documentación API

http://localhost:8081/swagger-ui.html

---

**Desarrollado por**: Rodrigo Delgadillo y Carolina Celis  
**Asignatura**: Desarrollo Fullstack 3  
**Puerto**: 8081  
**Health Check**: http://localhost:8081/actuator/health
