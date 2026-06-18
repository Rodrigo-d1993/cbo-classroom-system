# CBO Classroom System

Sistema de gestión escolar basado en microservicios para establecimientos educacionales chilenos.

## Descripción

Plataforma para la administración escolar que implementa:

- Sistema de calificaciones con escala 1.0 a 7.0
- Control de asistencia con mínimo 85% requerido
- Gestión de estudiantes con formato RUT chileno
- Sistema de apoderados y tutores legales
- Anotaciones disciplinarias y de comportamiento
- Control de acceso basado en roles (RBAC)

## Arquitectura

Microservicios con comunicación REST, autenticación JWT y base de datos MySQL independiente por servicio.

### Microservicios Implementados

| Microservicio | Puerto | Responsabilidad |
|--------------|--------|-----------------|
| ms-auth | 8081 | Autenticación y gestión de usuarios/roles |
| ms-students | 8082 | Gestión de estudiantes y apoderados |
| ms-grades | 8083 | Sistema de calificaciones (1.0-7.0) |
| ms-attendance | 8084 | Control de asistencia escolar |
| ms-annotations | 8085 | Anotaciones disciplinarias |

## Stack Tecnológico

- Spring Boot 3.5.14, Java 17
- MySQL 8.0
- Docker y Docker Compose
- JWT para autenticación

## Instalación

### Requisitos
- Java 17+
- Docker y Docker Compose
- Git

### Pasos

1. Clonar repositorio
```bash
git clone https://github.com/Rodrigo-d1993/cbo-classroom-system.git
cd cbo-classroom-system
```

2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Iniciar servicios
```bash
docker-compose up -d
```

4. Verificar
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
Cada microservicio expone Swagger UI en `/swagger-ui.html`

## Roles y Permisos

El sistema implementa los siguientes roles:

- **ADMIN_SISTEMA**: Control total del sistema
- **DIRECTOR**: Gestión completa del establecimiento
- **INSPECTOR**: Control de asistencia y disciplina
- **DOCENTE**: Registro de notas y asistencia
- **APODERADO**: Consulta información de sus pupilos
- **ESTUDIANTE**: Consulta su propia información

## Estructura

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

## Desarrollo

```bash
cd ms-{nombre}
./mvnw spring-boot:run
./mvnw clean package
./mvnw test
```

## Comandos Docker

```bash
docker-compose up -d              # Iniciar
docker-compose logs -f ms-auth    # Ver logs
docker-compose restart ms-auth    # Reiniciar
docker-compose down               # Detener
```

## Seguridad

- No commitear `.env`
- JWT_SECRET mínimo 256 bits  
- Usar HTTPS en producción

## Autores

**Desarrollado por**: Rodrigo Delgadillo y Carolina Celis  
**Asignatura**: Desarrollo Fullstack 3  
**Año**: 2026

## Repositorio

https://github.com/Rodrigo-d1993/cbo-classroom-system

