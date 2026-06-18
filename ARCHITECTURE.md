# 🏗️ Arquitectura del Sistema CBO Classroom

## 📋 Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Arquitectura de Microservicios](#arquitectura-de-microservicios)
3. [Orden de Construcción](#orden-de-construcción)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Base de Datos](#base-de-datos)
7. [Seguridad](#seguridad)
8. [Configuración de Entorno](#configuración-de-entorno)
9. [Comunicación Entre Servicios](#comunicación-entre-servicios)

---

## 🎯 Visión General

**CBO Classroom System** es un sistema de gestión escolar basado en microservicios para el Colegio Bernardo O'Higgins (CBO). El sistema gestiona:
- Autenticación y autorización de usuarios
- Gestión de estudiantes y apoderados
- Control de asistencia
- Calificaciones y evaluaciones
- Anotaciones y observaciones
- Notificaciones (email/push)
- Generación de reportes

### Principios de Diseño

1. **Microservicios independientes** - Cada servicio tiene su propia base de datos
2. **API-First** - APIs REST bien documentadas con OpenAPI/Swagger
3. **Seguridad por diseño** - Autenticación JWT, RBAC, validaciones robustas
4. **Observabilidad** - Logs estructurados, métricas, trazabilidad
5. **Resilencia** - Circuit breakers, timeouts, retries
6. **Escalabilidad horizontal** - Servicios stateless, preparados para contenedores

---

## 🏛️ Arquitectura de Microservicios

### Diagrama de Alto Nivel

```
                                 ┌─────────────┐
                                 │   Cliente   │
                                 │ (Frontend)  │
                                 └──────┬──────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │    API Gateway        │
                            │   (ms-gateway)        │
                            │  - Auth JWT           │
                            │  - Rate Limiting      │
                            │  - Routing            │
                            └───────────┬───────────┘
                                        │
                ┌───────────────────────┼───────────────────────┐
                │                       │                       │
                ▼                       ▼                       ▼
        ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
        │   ms-auth     │      │ ms-students   │      │  ms-grades    │
        │               │      │               │      │               │
        │ - Login       │      │ - CRUD        │      │ - CRUD        │
        │ - Register    │      │ - Search      │      │ - Cálculos    │
        │ - JWT         │      │               │      │               │
        └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
                │                      │                      │
                ▼                      ▼                      ▼
        ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
        │   db-auth     │      │ db-students   │      │  db-grades    │
        │   (MySQL)     │      │   (MySQL)     │      │   (MySQL)     │
        └───────────────┘      └───────────────┘      └───────────────┘

                ┌───────────────┐      ┌───────────────┐
                │ ms-attendance │      │ms-annotations │
                │               │      │               │
                │ - Registro    │      │ - Positivas   │
                │ - Reportes    │      │ - Negativas   │
                └───────┬───────┘      └───────┬───────┘
                        │                      │
                        ▼                      ▼
                ┌───────────────┐      ┌───────────────┐
                │db-attendance  │      │db-annotations │
                │   (MySQL)     │      │   (MySQL)     │
                └───────────────┘      └───────────────┘

                ┌───────────────┐      ┌───────────────┐
                │ms-notifications│     │  ms-reports   │
                │               │      │               │
                │ - Email       │      │ - PDF         │
                │ - Push        │      │ - Excel       │
                └───────┬───────┘      └───────────────┘
                        │
                        ▼
                ┌───────────────┐
                │   RabbitMQ    │
                │  (Messaging)  │
                └───────────────┘
```

---

## 📊 Orden de Construcción de Microservicios

### ✅ Fase 1: Fundamentos (COMPLETADO)
**Estado:** ✅ Implementado y probado

1. **ms-auth** ✅
   - Autenticación JWT
   - Gestión de usuarios
   - Control de roles (RBAC)
   - **Puerto:** 8081
   - **DB:** db-auth (MySQL)

### 🚀 Fase 2: Gateway y Discovery (CRÍTICO)
**Prioridad:** ALTA - Construir ANTES de continuar con otros microservicios

2. **ms-gateway** 🔴 **SIGUIENTE**
   - API Gateway con Spring Cloud Gateway
   - Autenticación centralizada (valida JWT de ms-auth)
   - Rate limiting global
   - Circuit breaker
   - Routing dinámico
   - CORS centralizado
   - **Puerto:** 8080
   - **NO requiere DB propia**
   
   **¿Por qué construirlo ahora?**
   - Evita duplicar lógica de autenticación en cada servicio
   - Punto único de entrada para todos los servicios
   - Facilita la comunicación entre servicios
   - Simplifica la configuración del frontend

3. **Service Discovery** (Opcional pero recomendado) 🟡
   - Eureka Server o Consul
   - Registro automático de servicios
   - Health checks
   - Load balancing
   - **Puerto:** 8761 (si usas Eureka)

### 📚 Fase 3: Dominio Central (CORE)
**Prioridad:** ALTA - Entidades principales del sistema

4. **ms-students** 🟡
   - Gestión de estudiantes
   - Gestión de apoderados
   - Relaciones familia
   - Matrícula
   - **Puerto:** 8082
   - **DB:** db-students (MySQL)

5. **ms-grades** 🟡
   - Gestión de notas
   - Asignaturas
   - Períodos escolares
   - Cálculo de promedios
   - **Puerto:** 8083
   - **DB:** db-grades (MySQL)

### 📅 Fase 4: Operaciones Diarias
**Prioridad:** MEDIA

6. **ms-attendance** 🟢
   - Registro de asistencia
   - Justificaciones
   - Reportes de asistencia
   - **Puerto:** 8084
   - **DB:** db-attendance (MySQL)

7. **ms-annotations** 🟢
   - Anotaciones positivas
   - Anotaciones negativas
   - Historial por estudiante
   - **Puerto:** 8085
   - **DB:** db-annotations (MySQL)

### 🔔 Fase 5: Servicios de Soporte
**Prioridad:** BAJA - Construir al final

8. **ms-notifications** 🟢
   - Envío de emails
   - Notificaciones push
   - Templates de mensajes
   - **Puerto:** 8086
   - **Requiere:** RabbitMQ o Kafka
   - **DB:** db-notifications (MySQL) - Para historial

9. **ms-reports** 🟢
   - Generación de reportes PDF
   - Exportación a Excel
   - Certificados
   - Informes académicos
   - **Puerto:** 8087
   - **DB:** Solo lectura de otras DBs o cache

---

## 🛠️ Stack Tecnológico

### Backend
- **Lenguaje:** Java 17
- **Framework:** Spring Boot 3.5.x
- **Security:** Spring Security + JWT
- **Data:** Spring Data JPA + Hibernate
- **Validation:** Hibernate Validator
- **Documentation:** SpringDoc OpenAPI (Swagger)
- **Testing:** JUnit 5, Mockito, TestContainers

### Base de Datos
- **RDBMS:** MySQL 8.0
- **Migrations:** Flyway (recomendado para implementar)
- **Connection Pool:** HikariCP

### Infraestructura
- **Containerization:** Docker + Docker Compose
- **API Gateway:** Spring Cloud Gateway
- **Service Discovery:** Eureka Server (opcional)
- **Messaging:** RabbitMQ o Apache Kafka (fase 5)
- **CI/CD:** GitHub Actions

### Observabilidad
- **Metrics:** Spring Boot Actuator + Micrometer
- **Tracing:** Spring Cloud Sleuth + Zipkin (futuro)
- **Logging:** SLF4J + Logback
- **Monitoring:** Prometheus + Grafana (futuro)

---

## 🎨 Patrones de Diseño

### Patrones de Microservicios

1. **Database per Service**
   - Cada microservicio tiene su propia base de datos
   - No hay acceso directo entre bases de datos
   - Comunicación vía API REST o eventos

2. **API Gateway Pattern**
   - Punto único de entrada (ms-gateway)
   - Routing a servicios internos
   - Autenticación centralizada
   - Rate limiting y throttling

3. **Circuit Breaker Pattern**
   - Resilience4j en gateway
   - Prevención de cascading failures
   - Fallback mechanisms

4. **Event-Driven Architecture** (Fase 5)
   - Mensajería asíncrona con RabbitMQ/Kafka
   - Eventos de dominio (UserCreated, GradeUpdated, etc.)
   - Eventual consistency

5. **Saga Pattern** (Futuro)
   - Transacciones distribuidas
   - Compensating transactions
   - Orquestación vs Coreografía

### Patrones de Código

- **Repository Pattern** - Acceso a datos
- **Service Layer Pattern** - Lógica de negocio
- **DTO Pattern** - Transferencia de datos
- **Builder Pattern** - Construcción de objetos complejos
- **Strategy Pattern** - Cálculo de notas, generación de reportes

---

## 💾 Base de Datos

### Estrategia de Base de Datos

**Principio:** Database per Service
- Cada microservicio es dueño de su esquema
- No hay foreign keys entre bases de datos de diferentes servicios
- Integridad referencial se maneja a nivel de aplicación

### Esquemas por Microservicio

#### db-auth
```sql
tables:
  - users (id, username, password, email, active, created_at)
  - roles (id, name)
  - user_roles (user_id, role_id)
```

#### db-students (Futuro)
```sql
tables:
  - students (id, rut, name, birth_date, grade_level, ...)
  - guardians (id, rut, name, relationship, ...)
  - student_guardians (student_id, guardian_id)
  - enrollments (id, student_id, academic_year, status, ...)
```

#### db-grades (Futuro)
```sql
tables:
  - subjects (id, name, code, grade_level)
  - academic_periods (id, name, start_date, end_date)
  - grades (id, student_id, subject_id, period_id, value, ...)
  - evaluations (id, subject_id, name, weight, date)
```

### Migrations

**Recomendación:** Implementar Flyway en todos los microservicios

```
src/main/resources/db/migration/
  ├── V1__Initial_schema.sql
  ├── V2__Add_indexes.sql
  └── V3__Add_audit_columns.sql
```

---

## 🔐 Seguridad

### Modelo de Seguridad

#### Autenticación
- **JWT (JSON Web Tokens)** emitidos por ms-auth
- **Access Token:** 1 hora de vida
- **Refresh Token:** 7 días (implementar en futuro)

#### Autorización (RBAC)
```
Roles disponibles:
├── ADMIN_SISTEMA (Full access)
├── DIRECTOR (Gestión académica)
├── DOCENTE (Notas, asistencia, anotaciones)
├── INSPECTOR (Asistencia, anotaciones)
└── APODERADO (Solo lectura de sus hijos)
```

#### Permisos por Microservicio

**ms-auth:**
- Login/Refresh: Público
- CRUD usuarios: Solo ADMIN_SISTEMA
- Ver perfil propio: Autenticado

**ms-gateway:**
- Valida JWT en TODOS los requests
- Propaga headers de autenticación
- Rate limiting por IP/usuario

**ms-students:**
- CRUD: ADMIN_SISTEMA, DIRECTOR
- Lectura: DOCENTE, INSPECTOR
- Lectura (solo sus hijos): APODERADO

**ms-grades:**
- Escribir: DOCENTE (solo sus asignaturas), DIRECTOR
- Lectura: DOCENTE, INSPECTOR
- Lectura (solo sus hijos): APODERADO

**ms-attendance:**
- Escribir: DOCENTE, INSPECTOR
- Lectura: DOCENTE, INSPECTOR, DIRECTOR
- Lectura (solo sus hijos): APODERADO

**ms-annotations:**
- Escribir: DOCENTE, INSPECTOR, DIRECTOR
- Lectura: DOCENTE, INSPECTOR, DIRECTOR
- Lectura (solo sus hijos): APODERADO

### Seguridad en APIs

```java
// Cada microservicio valida el JWT recibido desde el Gateway
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().hasAuthority("ADMIN_SISTEMA")
            );
        return http.build();
    }
}
```

---

## ⚙️ Configuración de Entorno

### Variables de Entorno (.env)

```env
# === JWT (Shared across services) ===
JWT_SECRET=<base64-secret-min-32-bytes>
JWT_EXPIRATION_MS=3600000

# === MySQL Root ===
MYSQL_ROOT_PASSWORD=<secure-password>

# === ms-auth ===
AUTH_DB_NAME=db_auth
AUTH_DB_USER=auth_user
AUTH_DB_PASS=<secure-password>
AUTH_PORT=8081

# === ms-gateway ===
GATEWAY_PORT=8080

# === ms-students ===
STUDENTS_DB_NAME=db_students
STUDENTS_DB_USER=students_user
STUDENTS_DB_PASS=<secure-password>
STUDENTS_PORT=8082

# === ms-grades ===
GRADES_DB_NAME=db_grades
GRADES_DB_USER=grades_user
GRADES_DB_PASS=<secure-password>
GRADES_PORT=8083

# === ms-attendance ===
ATTENDANCE_DB_NAME=db_attendance
ATTENDANCE_DB_USER=attendance_user
ATTENDANCE_DB_PASS=<secure-password>
ATTENDANCE_PORT=8084

# === ms-annotations ===
ANNOTATIONS_DB_NAME=db_annotations
ANNOTATIONS_DB_USER=annotations_user
ANNOTATIONS_DB_PASS=<secure-password>
ANNOTATIONS_PORT=8085

# === Spring Profile ===
SPRING_PROFILE=dev  # dev, prod, test
```

### Puertos Estándar

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| ms-gateway | 8080 | Punto de entrada único |
| ms-auth | 8081 | Autenticación |
| ms-students | 8082 | Estudiantes |
| ms-grades | 8083 | Calificaciones |
| ms-attendance | 8084 | Asistencia |
| ms-annotations | 8085 | Anotaciones |
| ms-notifications | 8086 | Notificaciones |
| ms-reports | 8087 | Reportes |
| Eureka Server | 8761 | Service Discovery |

---

## 🔄 Comunicación Entre Servicios

### Comunicación Síncrona (REST)

```
Frontend → Gateway → Microservicio
```

**Ejemplo:** Obtener notas de un estudiante
```
GET /api/grades/student/123
  ↓
Gateway valida JWT
  ↓
Gateway enruta a ms-grades
  ↓
ms-grades valida autorización
  ↓
ms-grades consulta DB
  ↓
Gateway retorna respuesta
```

### Comunicación Asíncrona (Eventos) - Fase 5

```java
// ms-students publica evento
eventPublisher.publish(new StudentEnrolledEvent(studentId, year));

// ms-notifications escucha evento
@RabbitListener(queues = "student-enrolled")
public void onStudentEnrolled(StudentEnrolledEvent event) {
    sendWelcomeEmail(event.getStudentId());
}
```

---

## 📦 Estructura de Proyecto de Microservicio

Cada microservicio sigue esta estructura:

```
ms-<nombre>/
├── src/
│   ├── main/
│   │   ├── java/com/bookclass/ms_<nombre>/
│   │   │   ├── config/          # Configuraciones (Security, OpenAPI, etc.)
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/
│   │   │   │   ├── request/     # DTOs de entrada
│   │   │   │   └── response/    # DTOs de salida
│   │   │   ├── exception/       # Excepciones y GlobalExceptionHandler
│   │   │   ├── model/
│   │   │   │   └── entity/      # Entidades JPA
│   │   │   ├── repository/      # Repositories JPA
│   │   │   ├── service/         # Interfaces de servicio
│   │   │   │   └── impl/        # Implementaciones de servicio
│   │   │   └── Application.java # Main class
│   │   └── resources/
│   │       ├── db/migration/    # Flyway migrations
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-prod.properties
│   └── test/                    # Tests unitarios e integración
├── Dockerfile
├── pom.xml
├── README.md
└── init.sql                     # Script inicial (migrar a Flyway)
```

---

## 🚀 Checklist de Construcción de Microservicio

Cuando construyas un nuevo microservicio, sigue este checklist:

### 1. Setup Inicial
- [ ] Crear estructura de carpetas según estándar
- [ ] Configurar pom.xml con dependencias necesarias
- [ ] Crear Application.java con @SpringBootApplication
- [ ] Configurar application.properties por profile

### 2. Base de Datos
- [ ] Diseñar esquema de base de datos
- [ ] Crear migrations de Flyway
- [ ] Agregar configuración de DB en docker-compose.yml
- [ ] Agregar variables de entorno en .env

### 3. Dominio
- [ ] Crear entidades JPA (@Entity)
- [ ] Crear repositories (extends JpaRepository)
- [ ] Crear DTOs (request/response)
- [ ] Implementar mappers (entity ↔ DTO)

### 4. Lógica de Negocio
- [ ] Crear interfaces de servicio
- [ ] Implementar servicios
- [ ] Agregar validaciones de negocio
- [ ] Agregar logging apropiado

### 5. API REST
- [ ] Crear controllers (@RestController)
- [ ] Documentar con OpenAPI (@Operation, @ApiResponse)
- [ ] Implementar paginación (si aplica)
- [ ] Implementar filtros de búsqueda

### 6. Seguridad
- [ ] Configurar SecurityConfig
- [ ] Implementar validación de JWT
- [ ] Configurar autorización por rol
- [ ] Validar permisos en métodos (@PreAuthorize)

### 7. Manejo de Errores
- [ ] Crear excepciones custom
- [ ] Implementar @RestControllerAdvice
- [ ] Retornar respuestas de error estructuradas

### 8. Testing
- [ ] Tests unitarios de servicios
- [ ] Tests de integración de controllers
- [ ] Tests de seguridad
- [ ] Configurar TestContainers (opcional)

### 9. Docker
- [ ] Crear Dockerfile optimizado
- [ ] Agregar servicio en docker-compose.yml
- [ ] Configurar health checks
- [ ] Configurar resource limits

### 10. CI/CD
- [ ] Crear workflow de GitHub Actions
- [ ] Configurar build y tests automáticos
- [ ] Agregar reportes de tests

### 11. Documentación
- [ ] Actualizar README del microservicio
- [ ] Documentar endpoints en Swagger
- [ ] Agregar ejemplos de uso
- [ ] Actualizar ARCHITECTURE.md

---

## 📚 Referencias y Recursos

### Documentación Oficial
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)

### Libros Recomendados
- "Microservices Patterns" - Chris Richardson
- "Building Microservices" - Sam Newman
- "Spring Microservices in Action" - John Carnell

### Herramientas
- [Postman](https://www.postman.com/) - Testing de APIs
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [DBeaver](https://dbeaver.io/) - Cliente de base de datos

---

## 💡 Consejos y Mejores Prácticas

### Desarrollo
1. **Comienza simple** - Implementa funcionalidad básica primero, luego optimiza
2. **Test primero** - Escribe tests mientras desarrollas, no al final
3. **Commits frecuentes** - Commits pequeños y descriptivos
4. **Code review** - Revisa PRs cuidadosamente
5. **Documentación continua** - Documenta mientras desarrollas

### Arquitectura
1. **Keep it simple** - No sobre-ingenierices
2. **Separation of concerns** - Una responsabilidad por clase
3. **DRY pero no excesivo** - No duplicar lógica crítica, pero evita abstracciones prematuras
4. **Fail fast** - Valida temprano, falla rápido
5. **Backward compatibility** - Cuida los cambios en APIs

### Operaciones
1. **Health checks everywhere** - Cada servicio debe tener /actuator/health
2. **Structured logging** - Logs consistentes y parseables
3. **Monitoring desde día 1** - Métricas desde el inicio
4. **Backup regular** - Bases de datos y configuraciones
5. **Disaster recovery plan** - Documenta cómo recuperar el sistema

---

**Última actualización:** 2026-06-03  
**Versión:** 1.0  
**Autor:** Rodrigo-d1993
