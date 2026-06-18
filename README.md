# CBO Classroom System

Sistema de gestión escolar basado en microservicios, diseñado específicamente para establecimientos educacionales chilenos. Implementa funcionalidades críticas como autenticación, gestión de estudiantes, control de asistencia, calificaciones y anotaciones disciplinarias.

## Descripción del Proyecto

CBO Classroom System es una plataforma completa para la administración de instituciones educativas que cumple con los estándares y requisitos del sistema escolar chileno:

- Sistema de calificaciones con escala 1.0 a 7.0
- Control de asistencia con mínimo 85% requerido
- Gestión de estudiantes con formato RUT chileno
- Sistema de apoderados y tutores legales
- Anotaciones disciplinarias y de comportamiento
- Control de acceso basado en roles (RBAC)

## Arquitectura

El sistema está construido siguiendo una arquitectura de microservicios con las siguientes características:

- **Patrón**: Microservices Architecture
- **Comunicación**: API REST
- **Autenticación**: JWT (JSON Web Tokens)
- **Base de datos**: Database-per-Service (MySQL 8.0)
- **Contenedores**: Docker + Docker Compose
- **Documentación**: OpenAPI 3.0 / Swagger UI

### Microservicios Implementados

| Microservicio | Puerto | Responsabilidad |
|--------------|--------|-----------------|
| ms-auth | 8081 | Autenticación y gestión de usuarios/roles |
| ms-students | 8082 | Gestión de estudiantes y apoderados |
| ms-grades | 8083 | Sistema de calificaciones (1.0-7.0) |
| ms-attendance | 8084 | Control de asistencia escolar |
| ms-annotations | 8085 | Anotaciones disciplinarias (en desarrollo) |

## Tecnologías Utilizadas

### Backend
- **Framework**: Spring Boot 3.5.14
- **Lenguaje**: Java 17
- **Build Tool**: Maven
- **ORM**: JPA / Hibernate
- **Seguridad**: Spring Security + JWT
- **Validación**: Jakarta Validation
- **Documentación**: Springdoc OpenAPI 3

### Base de Datos
- **Motor**: MySQL 8.0
- **Driver**: MySQL Connector/J
- **Pool**: HikariCP

### DevOps
- **Contenedores**: Docker
- **Orquestación**: Docker Compose
- **CI/CD**: GitHub Actions

## Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- Docker y Docker Compose
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd cbo-classroom-system
```

### 2. Configurar variables de entorno

Copiar el archivo de ejemplo y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones. Los valores críticos son:
- `JWT_SECRET`: Secret para firma de tokens (mínimo 256 bits)
- Credenciales de bases de datos para cada microservicio

### 3. Levantar servicios con Docker

```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Verificar estado
docker-compose ps
```

### 4. Verificar instalación

Cada microservicio expone un health check:

```bash
curl http://localhost:8081/actuator/health  # ms-auth
curl http://localhost:8082/actuator/health  # ms-students
curl http://localhost:8083/actuator/health  # ms-grades
curl http://localhost:8084/actuator/health  # ms-attendance
```

## Uso Básico

### 1. Registro de Usuario

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@example.com",
    "password": "Password123!",
    "roleName": "DOCENTE"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "Password123!"
  }'
```

Guardar el token JWT recibido para usarlo en requests subsecuentes.

### 3. Acceder a otros servicios

```bash
# Ejemplo: Listar estudiantes
curl -X GET http://localhost:8082/api/students \
  -H "Authorization: Bearer {tu-token-jwt}"
```

## Documentación API

Cada microservicio expone documentación Swagger UI:

- ms-auth: http://localhost:8081/swagger-ui.html
- ms-students: http://localhost:8082/swagger-ui.html
- ms-grades: http://localhost:8083/swagger-ui.html
- ms-attendance: http://localhost:8084/swagger-ui.html

## Roles y Permisos

El sistema implementa los siguientes roles:

- **ADMIN_SISTEMA**: Control total del sistema
- **DIRECTOR**: Gestión completa del establecimiento
- **INSPECTOR**: Control de asistencia y disciplina
- **DOCENTE**: Registro de notas y asistencia
- **APODERADO**: Consulta información de sus pupilos
- **ESTUDIANTE**: Consulta su propia información

## Estructura del Proyecto

```
cbo-classroom-system/
├── ms-auth/              # Microservicio de autenticación
├── ms-students/          # Microservicio de estudiantes
├── ms-grades/            # Microservicio de calificaciones
├── ms-attendance/        # Microservicio de asistencia
├── ms-annotations/       # Microservicio de anotaciones
├── docker-compose.yml    # Orquestación de servicios
├── .env                  # Variables de entorno (no commitear)
├── .env.example          # Plantilla de variables
└── README.md             # Este archivo
```

Cada microservicio contiene:
```
ms-{nombre}/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/bookclass/ms_{nombre}/
│   │   │       ├── config/      # Configuraciones
│   │   │       ├── controller/  # Controladores REST
│   │   │       ├── dto/         # Data Transfer Objects
│   │   │       ├── exception/   # Manejo de excepciones
│   │   │       ├── model/       # Entidades JPA
│   │   │       ├── repository/  # Repositorios
│   │   │       ├── security/    # Seguridad JWT
│   │   │       └── service/     # Lógica de negocio
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-prod.properties
│   └── test/            # Tests unitarios e integración
├── Dockerfile           # Imagen Docker
├── pom.xml             # Dependencias Maven
├── init.sql            # Script de inicialización BD
└── README.md           # Documentación del servicio
```

## Desarrollo Local

Para desarrollar un microservicio sin Docker:

```bash
cd ms-{nombre}
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Para compilar:

```bash
./mvnw clean package
```

Para ejecutar tests:

```bash
./mvnw test
```

## Comandos Útiles

### Docker

```bash
# Reconstruir un servicio específico
docker-compose up -d --build ms-auth

# Ver logs de un servicio
docker-compose logs -f ms-auth

# Reiniciar un servicio
docker-compose restart ms-auth

# Detener todo
docker-compose down

# Limpiar volúmenes (CUIDADO: borra datos)
docker-compose down -v
```

### Base de Datos

```bash
# Conectar a base de datos de un servicio
docker exec -it db-auth mysql -u auth_user -p

# Backup de base de datos
docker exec db-auth mysqldump -u root -p db_auth > backup.sql
```

## Testing

### Tests Unitarios

Cada microservicio incluye tests unitarios:

```bash
cd ms-auth
./mvnw test
```

### Tests de Integración

Ver archivo `TESTING_RESULTS.md` para procedimientos de testing manual.

## Troubleshooting

### Servicios no inician
- Verificar que los puertos no estén en uso
- Revisar logs: `docker-compose logs <servicio>`
- Verificar configuración .env

### Error de conexión a base de datos
- Esperar ~30 segundos para que MySQL inicie
- Verificar health checks
- Revisar credenciales en .env

### Error de autenticación JWT
- Verificar que JWT_SECRET sea el mismo en todos los servicios
- Verificar que el secret tenga al menos 32 bytes
- Verificar expiración del token

## Documentación Adicional

- [ARQUITECTURA_Y_PATRONES.md](./ARQUITECTURA_Y_PATRONES.md): Detalles de arquitectura y patrones de diseño
- [PROXIMOS_PASOS.md](./PROXIMOS_PASOS.md): Guía de desarrollo y próximas funcionalidades
- [GUIA_PARA_COLABORADORES.md](./GUIA_PARA_COLABORADORES.md): Guía para contribuidores

## Seguridad

- No commitear el archivo `.env` al repositorio
- Cambiar JWT_SECRET en producción
- Usar HTTPS en producción
- Implementar rate limiting en producción
- Revisar periódicamente dependencias para vulnerabilidades

## Licencia

Este proyecto es un trabajo académico desarrollado para fines educativos.

## Autores

Proyecto desarrollado como parte del curso de Ingeniería de Software.

## Fecha de Desarrollo

2024 - Sistema CBO Classroom

## Contacto

Para consultas sobre el proyecto, contactar al equipo de desarrollo.
