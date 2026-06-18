# Arquitectura y Patrones del Sistema CBO Classroom

## Resumen Ejecutivo

CBO Classroom System es una aplicación de gestión escolar basada en microservicios, diseñada específicamente para el sistema educativo chileno. El sistema implementa funcionalidades críticas como autenticación, gestión de estudiantes, calificaciones (escala 1.0-7.0), y control de asistencia (mínimo 85%).

## Arquitectura General del Sistema

### Tipo de Arquitectura
**Microservices Architecture** con Database-per-Service pattern

### Microservicios Implementados

| Microservicio | Puerto | Base de Datos | Responsabilidad |
|--------------|--------|---------------|-----------------|
| ms-auth | 8081 | db_auth | Autenticación y gestión de usuarios/roles |
| ms-students | 8082 | db_students | Gestión de estudiantes y apoderados |
| ms-grades | 8083 | db_grades | Sistema de calificaciones (1.0-7.0) |
| ms-attendance | 8084 | db_attendance | Control de asistencia escolar |
| ms-annotations | - | - | Anotaciones disciplinarias (pendiente) |

### Componentes de Infraestructura

- **Base de datos**: MySQL 8.0 (una instancia por microservicio)
- **Contenedores**: Docker + Docker Compose
- **Autenticación**: JWT (JSON Web Tokens) compartido
- **Documentación API**: OpenAPI 3.0 / Swagger UI
- **Monitoreo**: Spring Boot Actuator (health checks)

## Patrones de Diseño Implementados

### 1. Patrones Arquitectónicos

#### Microservices Pattern
- Cada servicio es independiente y desplegable por separado
- Comunicación mediante API REST
- Base de datos dedicada por servicio
- Escalabilidad independiente

#### Database per Service Pattern
- Cada microservicio gestiona su propia base de datos
- Evita acoplamiento entre servicios
- Permite elegir tecnología de persistencia específica por servicio
- Referencias entre servicios mediante IDs (studentId, teacherId, etc.)

#### API Gateway Pattern (futuro)
- Actualmente no implementado
- Recomendado para producción
- Facilitaría enrutamiento, load balancing, y rate limiting

### 2. Patrones de Código

#### Repository Pattern
Abstrae el acceso a datos mediante interfaces JPA
```java
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRut(String rut);
    List<Student> findByCurso(String curso);
}
```

#### Service Layer Pattern
Separación de lógica de negocio de controladores
```
Controller → Service Interface → Service Implementation → Repository
```

#### DTO (Data Transfer Object) Pattern
Separación entre entidades de dominio y objetos de transferencia
```
Entity (Student) ≠ DTO (StudentRequest, StudentResponse)
```

#### Builder Pattern
Construcción de objetos complejos (usado con Lombok @Builder)
```java
AttendanceResponse.builder()
    .studentId(1L)
    .fecha(LocalDate.now())
    .status(AttendanceStatus.PRESENTE)
    .build();
```

#### Strategy Pattern (implícito)
Diferentes estrategias de cálculo:
- Promedio de notas en ms-grades
- Porcentaje de asistencia en ms-attendance

### 3. Patrones de Seguridad

#### Token-Based Authentication
- JWT generado en ms-auth
- Validado en todos los microservicios
- Secret compartido (256 bits mínimo)

#### Role-Based Access Control (RBAC)
Roles implementados:
- ADMIN_SISTEMA: Control total
- DIRECTOR: Gestión escolar completa
- INSPECTOR: Control de asistencia y disciplina
- DOCENTE: Registro de notas y asistencia
- APODERADO: Consulta de información de sus estudiantes
- ESTUDIANTE: Consulta de propia información

#### Method-Level Security
```java
@PreAuthorize("hasAnyRole('DIRECTOR', 'ADMIN_SISTEMA')")
public ResponseEntity<GradeResponse> updateGrade(...)
```

### 4. Patrones de Persistencia

#### Active Record Pattern (JPA)
```java
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ...
}
```

#### Lazy Loading
```java
@ManyToMany(fetch = FetchType.LAZY)
private Set<Guardian> guardians;
```

#### Auditing Pattern
```java
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
}

@PreUpdate
protected void onUpdate() {
    updatedAt = LocalDateTime.now();
}
```

### 5. Patrones de Validación

#### Bean Validation
```java
@NotBlank(message = "RUT is required")
@Pattern(regexp = "^[0-9]{7,8}-[0-9Kk]$", message = "Invalid RUT format")
private String rut;

@DecimalMin(value = "1.0", message = "Minimum grade is 1.0")
@DecimalMax(value = "7.0", message = "Maximum grade is 7.0")
private BigDecimal nota;
```

#### Business Rule Validation
Validaciones de lógica de negocio en la capa de servicio:
- Un registro de asistencia por día por estudiante
- Solo ausencias pueden ser justificadas
- Nota debe estar entre 1.0 y 7.0

### 6. Patrones de Manejo de Errores

#### Centralized Exception Handling
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(...)
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(...)
}
```

#### Custom Exceptions
- ResourceNotFoundException
- Más excepciones custom según necesidad

### 7. Patrones de Configuración

#### Externalized Configuration
- Variables de entorno (.env)
- Profiles de Spring (dev, prod)
- Properties segregados por ambiente

#### Configuration Properties
```java
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
}
```

## Stack Tecnológico

### Backend
- **Framework**: Spring Boot 3.5.14
- **Lenguaje**: Java 17
- **Build Tool**: Maven
- **ORM**: JPA / Hibernate
- **Seguridad**: Spring Security
- **Validación**: Jakarta Validation
- **Documentación**: Springdoc OpenAPI 3

### Base de Datos
- **Motor**: MySQL 8.0
- **Driver**: MySQL Connector/J
- **Pool de Conexiones**: HikariCP

### Librerías Principales
- **JWT**: JJWT (io.jsonwebtoken) 0.12.6
- **Utilidades**: Lombok
- **Logging**: SLF4J + Logback

### DevOps
- **Contenedores**: Docker
- **Orquestación**: Docker Compose
- **CI/CD**: GitHub Actions (configurado para ms-auth)

## Principios Aplicados

### SOLID Principles

**Single Responsibility Principle**
- Cada clase tiene una única responsabilidad
- Separación: Controller → Service → Repository

**Open/Closed Principle**
- Extensible mediante interfaces (Service interfaces)
- Cerrado para modificación mediante abstracciones

**Liskov Substitution Principle**
- Implementaciones intercambiables de Service interfaces

**Interface Segregation Principle**
- Interfaces específicas por responsabilidad
- No hay interfaces "gordas"

**Dependency Inversion Principle**
- Dependencia de abstracciones (interfaces)
- Inyección de dependencias con Spring

### Clean Code Principles

- Nombres descriptivos (getAttendanceSummary, approveJustification)
- Métodos pequeños y enfocados
- Comentarios solo cuando son necesarios
- Código auto-documentado

### DRY (Don't Repeat Yourself)

- Código de seguridad JWT reutilizado
- Configuraciones base copiadas entre servicios
- Exception handling centralizado

## Consideraciones de Seguridad

### Autenticación
- JWT con firma HMAC-SHA256
- Secret mínimo 256 bits
- Expiración configurable (default 24 horas)

### Autorización
- RBAC a nivel de endpoint
- Method-level security
- Validación de roles en cada request

### Datos Sensibles
- Passwords hasheados con BCrypt
- JWT secret en variables de entorno
- No commits de .env al repositorio

### Contenedores
- Usuarios no-root en Docker
- Multi-stage builds para optimizar imágenes
- Health checks configurados

## Escalabilidad y Performance

### Optimizaciones Implementadas

**Base de Datos**
- Índices en columnas de búsqueda frecuente
- Connection pooling (HikariCP)
- Lazy loading de relaciones

**Queries**
- Custom queries optimizadas
- Proyecciones específicas
- Paginación lista para implementar

**Caching**
- Preparado para Redis (no implementado aún)
- Stateless (JWT permite horizontal scaling)

**Docker**
- Resource limits configurados
- Health checks para reinicio automático
- JVM tuning para contenedores

## Flujo de Datos

### Autenticación (ms-auth)
```
1. Usuario envía credenciales
2. ms-auth valida contra db_auth
3. Si válido, genera JWT con roles
4. Cliente recibe token
5. Cliente incluye token en requests subsecuentes
6. Otros microservicios validan token con mismo secret
```

### Registro de Calificación (ms-grades)
```
1. DOCENTE envía POST /api/grades con JWT
2. JwtAuthenticationFilter valida token
3. SecurityConfig verifica rol DOCENTE
4. GradeController recibe request
5. GradeService valida nota (1.0-7.0)
6. GradeRepository persiste en db_grades
7. Response con GradeResponse DTO
```

### Cálculo de Asistencia (ms-attendance)
```
1. Cliente solicita GET /api/attendance/student/{id}/summary
2. AttendanceService obtiene todos los registros
3. Cuenta PRESENTE + ATRASADO + JUSTIFICADO
4. Calcula porcentaje con BigDecimal
5. Determina estado (OK/AT_RISK/CRITICAL)
6. Retorna AttendanceSummaryResponse
```

## Estado Actual del Proyecto

### Completado (4 de 5 microservicios)

**ms-auth**
- Registro y login
- Gestión de usuarios y roles
- Generación y validación JWT
- RBAC completo
- 23 tests pasando

**ms-students**
- CRUD de estudiantes
- Gestión de apoderados (entidad creada)
- Búsqueda por RUT
- Filtro por curso
- Validación formato chileno

**ms-grades**
- CRUD de asignaturas
- Registro de notas (1.0-7.0)
- Tipos de evaluación
- Cálculo automático de promedios
- Determinación APROBADO/REPROBADO (nota >= 4.0)

**ms-attendance**
- Registro diario de asistencia
- Estados: PRESENTE, AUSENTE, ATRASADO, JUSTIFICADO
- Sistema de justificaciones
- Workflow de aprobación
- Cálculo de porcentaje de asistencia
- Alertas automáticas (OK/AT_RISK/CRITICAL)

### Pendiente

**ms-annotations**
- Anotaciones disciplinarias
- Observaciones de comportamiento
- Historial por estudiante
- Tipos de anotación (positiva/negativa/neutral)

**Integraciones**
- Validación cross-service (verificar que studentId existe)
- Comunicación síncrona entre servicios
- Event-driven architecture (opcional)

**API Gateway**
- Punto de entrada único
- Load balancing
- Rate limiting
- Agregación de respuestas

**Frontend**
- Siendo desarrollado por el equipo
- Debe ser básico para la entrega

## Próximos Pasos Recomendados

Ver archivo PROXIMOS_PASOS.md para detalles de implementación.
