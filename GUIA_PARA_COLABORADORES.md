# 🤝 Guía para Colaboradores - CBO Classroom System

## 📖 Para IAs, Desarrolladores y Nuevos Colaboradores

Este documento explica cómo entender rápidamente el proyecto **CBO Classroom System** y colaborar eficientemente en el desarrollo de microservicios.

---

## 🎯 ¿Qué es este Proyecto?

**CBO Classroom System** es un sistema de gestión escolar basado en microservicios para el Colegio Bernardo O'Higgins (CBO), desarrollado en Java con Spring Boot.

### Características Principales
- ✅ Autenticación y autorización con JWT
- ✅ Arquitectura de microservicios independientes
- ✅ Base de datos por servicio (Database per Service pattern)
- ✅ Containerizado con Docker
- ✅ APIs REST documentadas con Swagger/OpenAPI
- ✅ Control de acceso basado en roles (RBAC)

---

## 📂 Estructura del Proyecto

```
cbo-classroom-system/
├── ms-auth/              ✅ COMPLETADO - Autenticación y gestión de usuarios
├── ms-gateway/           🔴 PRÓXIMO - API Gateway (Spring Cloud Gateway)
├── ms-students/          ⬜ PENDIENTE - Gestión de estudiantes
├── ms-grades/            ⬜ PENDIENTE - Calificaciones
├── ms-attendance/        ⬜ PENDIENTE - Asistencia
├── ms-annotations/       ⬜ PENDIENTE - Anotaciones
├── ms-notifications/     ⬜ PENDIENTE - Notificaciones
├── ms-reports/           ⬜ PENDIENTE - Reportes
├── scripts/              Scripts de utilidad (generación de secrets)
├── .env                  Variables de entorno (NO COMMITEAR)
├── .env.example          Template de variables
├── docker-compose.yml    Orquestación de servicios
└── ARCHITECTURE.md       Arquitectura detallada del sistema
```

---

## 🚦 Estado Actual del Proyecto

### ✅ Completado
- **ms-auth** (100%)
  - Autenticación JWT
  - Registro de usuarios
  - Control de roles (ADMIN_SISTEMA, DIRECTOR, DOCENTE, INSPECTOR, APODERADO)
  - Validaciones de seguridad
  - Logging de auditoría
  - Tests completos
  - Dockerfile optimizado
  - CI/CD configurado

### 🔴 En Progreso
- Ninguno actualmente

### ⬜ Pendiente
- ms-gateway (Prioridad CRÍTICA - debe construirse AHORA)
- Resto de microservicios (ver orden en ARCHITECTURE.md)

---

## 🔑 Información Clave para Entender el Proyecto

### Stack Tecnológico
```yaml
Backend: Java 17 + Spring Boot 3.5.x
Security: Spring Security + JWT (jjwt 0.12.6)
Database: MySQL 8.0 (una DB por microservicio)
Containerization: Docker + Docker Compose
Documentation: SpringDoc OpenAPI 3
Testing: JUnit 5 + Mockito + TestContainers
CI/CD: GitHub Actions
```

### Arquitectura de Seguridad

#### Flujo de Autenticación
```
1. Usuario hace POST /auth/login con username/password
2. ms-auth valida credenciales
3. ms-auth genera JWT firmado con el secreto compartido
4. JWT contiene: username, role, userId
5. Cliente guarda JWT y lo envía en header Authorization: Bearer <token>
6. Cada microservicio valida el JWT con el mismo secreto
```

#### Roles y Permisos
```
ADMIN_SISTEMA → Acceso total al sistema
DIRECTOR      → Gestión académica completa
DOCENTE       → Notas, asistencia, anotaciones de sus cursos
INSPECTOR     → Asistencia y anotaciones
APODERADO     → Solo lectura de información de sus hijos
```

### Base de Datos

**Patrón:** Database per Service

```
Cada microservicio tiene su propia base de datos:
- ms-auth      → db-auth
- ms-students  → db-students
- ms-grades    → db-grades
- etc.

❌ NO se permite acceso directo entre bases de datos
✅ Comunicación solo vía APIs REST
```

---

## 🛠️ Cómo Construir un Nuevo Microservicio

### 1. Prerequisitos

Antes de comenzar, asegúrate de:
- [ ] Leer ARCHITECTURE.md completo
- [ ] Entender el patrón usado en ms-auth
- [ ] Tener Docker y Docker Compose instalados
- [ ] Tener JDK 17 configurado
- [ ] Conocer Spring Boot y Spring Security

### 2. Orden de Construcción

**⚠️ IMPORTANTE:** Construir en este orden específico:

```
1. ms-gateway    (PRÓXIMO - CRÍTICO)
2. ms-students   (Core domain)
3. ms-grades     (Core domain)
4. ms-attendance (Operaciones diarias)
5. ms-annotations (Operaciones diarias)
6. ms-notifications (Soporte)
7. ms-reports    (Soporte)
```

**¿Por qué este orden?**
- **ms-gateway primero** porque centraliza la autenticación para todos los demás servicios
- **ms-students antes de grades** porque las notas requieren saber quiénes son los estudiantes
- **Notificaciones y reportes al final** porque dependen de los demás servicios

### 3. Template de Microservicio

Usa ms-auth como template de referencia. Cada microservicio debe tener:

```
ms-<nombre>/
├── src/
│   ├── main/
│   │   ├── java/com/bookclass/ms_<nombre>/
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java      ⚠️ OBLIGATORIO
│   │   │   │   ├── OpenApiConfig.java       ⚠️ OBLIGATORIO
│   │   │   │   └── JwtProperties.java       (si valida JWT)
│   │   │   ├── controller/                  ⚠️ OBLIGATORIO
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   ├── exception/
│   │   │   │   └── GlobalExceptionHandler.java ⚠️ OBLIGATORIO
│   │   │   ├── model/entity/                ⚠️ OBLIGATORIO
│   │   │   ├── repository/                  ⚠️ OBLIGATORIO
│   │   │   ├── service/                     ⚠️ OBLIGATORIO
│   │   │   │   └── impl/
│   │   │   └── Application.java             ⚠️ OBLIGATORIO
│   │   └── resources/
│   │       ├── application.properties       ⚠️ OBLIGATORIO
│   │       ├── application-dev.properties   ⚠️ OBLIGATORIO
│   │       ├── application-prod.properties  ⚠️ OBLIGATORIO
│   │       └── db/migration/                (Flyway migrations)
│   └── test/                                ⚠️ OBLIGATORIO
├── Dockerfile                               ⚠️ OBLIGATORIO
├── pom.xml                                  ⚠️ OBLIGATORIO
└── README.md                                ⚠️ OBLIGATORIO
```

### 4. Dependencias Mínimas en pom.xml

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.6</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.6</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.6</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.1.0</version>
    </dependency>
    
    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 5. Configuración de Seguridad (CRÍTICO)

Cada microservicio (excepto ms-gateway) debe validar JWT:

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/actuator/health",
                    "/v3/api-docs/**",
                    "/swagger-ui/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### 6. Agregar al docker-compose.yml

```yaml
# Base de datos del nuevo microservicio
db-<nombre>:
  image: mysql:8.0
  environment:
    MYSQL_DATABASE: ${NOMBRE_DB_NAME}
    MYSQL_USER: ${NOMBRE_DB_USER}
    MYSQL_PASSWORD: ${NOMBRE_DB_PASS}
    MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
  volumes:
    - db_<nombre>_data:/var/lib/mysql
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
    interval: 10s
    retries: 5
  restart: unless-stopped
  networks:
    - backend

# Microservicio
ms-<nombre>:
  build: ./ms-<nombre>
  ports:
    - "${NOMBRE_PORT}:80XX"  # Asignar puerto único
  environment:
    SPRING_DATASOURCE_URL: jdbc:mysql://db-<nombre>:3306/${NOMBRE_DB_NAME}
    SPRING_DATASOURCE_USERNAME: ${NOMBRE_DB_USER}
    SPRING_DATASOURCE_PASSWORD: ${NOMBRE_DB_PASS}
    JWT_SECRET: ${JWT_SECRET}  # ⚠️ Mismo secret para todos
    SPRING_PROFILES_ACTIVE: ${SPRING_PROFILE}
  depends_on:
    db-<nombre>:
      condition: service_healthy
  restart: unless-stopped
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80XX/actuator/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
  networks:
    - backend

volumes:
  db_<nombre>_data:
```

### 7. Agregar Variables en .env

```env
# === ms-<nombre> ===
NOMBRE_DB_NAME=db_<nombre>
NOMBRE_DB_USER=<nombre>_user
NOMBRE_DB_PASS=<secure-password>
NOMBRE_PORT=80XX
```

### 8. Crear Workflow de CI

Copia `.github/workflows/ci-auth.yml` y adapta:

```yaml
name: CI - ms-<nombre>

on:
  push:
    paths:
      - 'ms-<nombre>/**'
  pull_request:
    paths:
      - 'ms-<nombre>/**'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven
      
      - name: Build and test
        working-directory: ms-<nombre>
        run: ./mvnw clean package
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: ms-<nombre>-test-results
          path: ms-<nombre>/target/surefire-reports/
```

---

## 📝 Checklist Completo para Nuevo Microservicio

Usa esta checklist cuando construyas un nuevo microservicio:

### Fase 1: Setup
- [ ] Crear estructura de carpetas según template
- [ ] Configurar pom.xml con dependencias
- [ ] Crear Application.java
- [ ] Configurar application.properties (común, dev, prod)
- [ ] Diseñar esquema de base de datos

### Fase 2: Base de Datos
- [ ] Crear migrations de Flyway en db/migration/
- [ ] Agregar servicio de DB en docker-compose.yml
- [ ] Agregar variables en .env y .env.example
- [ ] Probar conexión a DB

### Fase 3: Dominio
- [ ] Crear entidades JPA con @Entity
- [ ] Crear repositories extends JpaRepository
- [ ] Crear DTOs (request/response)
- [ ] Implementar mappers

### Fase 4: Servicios
- [ ] Crear interfaces de servicio
- [ ] Implementar servicios con @Service
- [ ] Agregar validaciones de negocio
- [ ] Agregar logging con @Slf4j

### Fase 5: Controllers
- [ ] Crear controllers con @RestController
- [ ] Documentar con @Operation, @ApiResponse
- [ ] Implementar paginación (Page/Pageable)
- [ ] Implementar búsqueda/filtros

### Fase 6: Seguridad
- [ ] Crear SecurityConfig
- [ ] Crear JwtProperties y JwtService (copiar de ms-auth)
- [ ] Crear JwtAuthenticationFilter (copiar de ms-auth)
- [ ] Configurar autorización por rol
- [ ] Agregar @PreAuthorize en métodos sensibles

### Fase 7: Excepciones
- [ ] Crear excepciones custom
- [ ] Implementar GlobalExceptionHandler
- [ ] Retornar respuestas estructuradas

### Fase 8: OpenAPI
- [ ] Crear OpenApiConfig
- [ ] Documentar todos los endpoints
- [ ] Configurar bearerAuth scheme
- [ ] Probar en Swagger UI

### Fase 9: Testing
- [ ] Tests unitarios de servicios (80%+ coverage)
- [ ] Tests de integración de controllers
- [ ] Tests de seguridad (acceso no autorizado)
- [ ] Configurar application-test.properties

### Fase 10: Docker
- [ ] Crear Dockerfile (copiar de ms-auth)
- [ ] Agregar servicio en docker-compose.yml
- [ ] Configurar health checks
- [ ] Configurar resource limits
- [ ] Probar `docker-compose up ms-<nombre>`

### Fase 11: CI/CD
- [ ] Crear workflow en .github/workflows/
- [ ] Verificar que tests pasen en CI
- [ ] Configurar cache de Maven

### Fase 12: Documentación
- [ ] Crear README.md del microservicio
- [ ] Documentar endpoints principales
- [ ] Agregar ejemplos de uso
- [ ] Actualizar ARCHITECTURE.md
- [ ] Actualizar esta guía si es necesario

---

## 🎓 Conceptos Clave que Debes Conocer

### 1. JWT (JSON Web Tokens)

```
Estructura de JWT:
header.payload.signature

Ejemplo real:
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTl9TSVNURU1BIn0.x1y2z3...

Payload decodificado:
{
  "sub": "admin",           // username
  "role": "ADMIN_SISTEMA",  // rol del usuario
  "userId": 1,              // ID del usuario
  "iat": 1234567890,        // issued at
  "exp": 1234571490         // expiration
}
```

**⚠️ CRÍTICO:** Todos los microservicios deben usar el MISMO `JWT_SECRET` para validar tokens.

### 2. RBAC (Role-Based Access Control)

```java
// En el controller
@PreAuthorize("hasAuthority('ADMIN_SISTEMA')")
@PostMapping("/users")
public ResponseEntity<?> createUser(@RequestBody UserRequest request) {
    // Solo ADMIN_SISTEMA puede ejecutar esto
}

@PreAuthorize("hasAnyAuthority('DOCENTE', 'DIRECTOR')")
@PostMapping("/grades")
public ResponseEntity<?> createGrade(@RequestBody GradeRequest request) {
    // DOCENTE o DIRECTOR pueden ejecutar esto
}

@PreAuthorize("isAuthenticated()")
@GetMapping("/profile")
public ResponseEntity<?> getProfile() {
    // Cualquier usuario autenticado
}
```

### 3. Database per Service

```
❌ INCORRECTO:
ms-grades → accede directamente a db-students

✅ CORRECTO:
ms-grades → llama API REST de ms-students
```

**Razón:** Permite que cada servicio evolucione independientemente.

### 4. DTO Pattern

```java
// Entity (NO exponer directamente)
@Entity
public class User {
    private Long id;
    private String password;  // ⚠️ Nunca exponer
    private String email;
}

// Response DTO (exponer vía API)
public class UserResponse {
    private Long id;
    private String email;
    // Sin password
}
```

### 5. Service Layer

```
Controller → Service → Repository → Database

- Controller: Maneja HTTP, validación de entrada
- Service: Lógica de negocio
- Repository: Acceso a datos
```

---

## 🚨 Errores Comunes a Evitar

### 1. ❌ JWT Secret Diferente
```yaml
# MAL: Cada servicio con secret diferente
ms-auth: JWT_SECRET=secret1
ms-students: JWT_SECRET=secret2  # ❌ Token no validará
```

```yaml
# BIEN: Mismo secret en todos
JWT_SECRET=mismo-secret-para-todos  # ✅
```

### 2. ❌ Acceso Directo a Otras Bases de Datos
```java
// MAL
@Autowired
private DataSource studentsDataSource;  // ❌
```

```java
// BIEN
@Autowired
private StudentsClient studentsClient;  // ✅ RestTemplate o Feign
```

### 3. ❌ Exponer Stack Traces
```java
// MAL
@ExceptionHandler(Exception.class)
public ResponseEntity<?> handle(Exception ex) {
    return ResponseEntity.status(500).body(ex.getMessage());  // ❌ Expone internals
}
```

```java
// BIEN
@ExceptionHandler(Exception.class)
public ResponseEntity<?> handle(Exception ex) {
    log.error("Unexpected error", ex);
    return ResponseEntity.status(500)
        .body(Map.of("error", "Internal server error"));  // ✅ Genérico
}
```

### 4. ❌ No Validar Entrada
```java
// MAL
@PostMapping("/users")
public ResponseEntity<?> create(@RequestBody UserRequest req) {
    // Sin @Valid  ❌
}
```

```java
// BIEN
@PostMapping("/users")
public ResponseEntity<?> create(@Valid @RequestBody UserRequest req) {
    // Con @Valid  ✅
}
```

### 5. ❌ Hardcodear Configuración
```java
// MAL
String dbUrl = "jdbc:mysql://localhost:3306/db";  // ❌
```

```java
// BIEN
@Value("${spring.datasource.url}")
private String dbUrl;  // ✅
```

---

## 🔍 Cómo Debuggear Problemas Comunes

### Problema: JWT Token Invalid
```bash
# 1. Verificar que JWT_SECRET es el mismo en todos los servicios
docker-compose exec ms-auth env | grep JWT_SECRET
docker-compose exec ms-students env | grep JWT_SECRET

# 2. Decodificar JWT en jwt.io para ver payload
# 3. Verificar que el token no haya expirado
# 4. Verificar que JwtService.validateSecret() no lance excepción
```

### Problema: Connection Refused a Base de Datos
```bash
# 1. Verificar que DB está corriendo
docker-compose ps

# 2. Verificar health check
docker-compose exec db-auth mysqladmin ping

# 3. Verificar variables de entorno
docker-compose exec ms-auth env | grep DATASOURCE

# 4. Verificar logs de DB
docker-compose logs db-auth
```

### Problema: Tests Fallan
```bash
# 1. Verificar que application-test.properties existe
# 2. Verificar que H2 está en dependencias de test
# 3. Ejecutar tests con logs
./mvnw test -X

# 4. Verificar que @SpringBootTest apunta a clase correcta
```

### Problema: Docker Build Falla
```bash
# 1. Verificar que mvnw tiene permisos de ejecución
chmod +x mvnw

# 2. Limpiar y rebuildar
./mvnw clean package
docker-compose build --no-cache ms-<nombre>

# 3. Verificar Dockerfile paths
# 4. Verificar .dockerignore no excluye archivos necesarios
```

---

## 📚 Recursos de Aprendizaje

### Para Entender el Proyecto
1. Lee en este orden:
   - [ ] README.md (overview)
   - [ ] ARCHITECTURE.md (arquitectura completa)
   - [ ] ms-auth/README.md (ejemplo completo)
   - [ ] CORRECCIONES_IMPLEMENTADAS.md (mejores prácticas aplicadas)

2. Explora el código de ms-auth:
   - [ ] SecurityConfig.java
   - [ ] JwtService.java
   - [ ] AuthController.java
   - [ ] AuthServiceImpl.java
   - [ ] GlobalExceptionHandler.java

3. Prueba la API:
   - [ ] Levanta el proyecto: `docker-compose up`
   - [ ] Abre Swagger: http://localhost:8081/swagger-ui.html
   - [ ] Prueba login, crear usuario, etc.

### Documentación Oficial
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [JWT.io](https://jwt.io/) - Decodificador de JWT

---

## 💬 Comunicación con el Equipo

### Para Nuevos Colaboradores

**Antes de empezar:**
1. Lee toda esta guía
2. Lee ARCHITECTURE.md
3. Clona el repo y levanta ms-auth
4. Juega con la API en Swagger
5. Lee el código de ms-auth línea por línea

**Cuando tengas dudas:**
1. Busca en la documentación primero
2. Busca en el código existente (ms-auth)
3. Pregunta en el canal de desarrollo
4. Documenta la solución para futuros colaboradores

**Al abrir un PR:**
1. Asegúrate que todos los tests pasen
2. Actualiza README.md si agregaste funcionalidad
3. Agrega tests para tu código nuevo
4. Usa commits descriptivos
5. Solicita code review

---

## 🎯 Próximos Pasos

### Para Quien Construirá el Próximo Microservicio (ms-gateway)

El siguiente microservicio DEBE ser **ms-gateway**. Aquí está por qué y qué debe hacer:

#### ¿Por qué ms-gateway es crítico?
1. **Centraliza autenticación** - Evita duplicar lógica JWT en cada servicio
2. **Punto único de entrada** - Frontend solo habla con el gateway (puerto 8080)
3. **Rate limiting** - Protege todos los servicios simultáneamente
4. **Circuit breaker** - Maneja fallos de servicios backend
5. **CORS centralizado** - Configuración única de CORS

#### Tecnología para ms-gateway
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

#### Responsabilidades del Gateway
```yaml
Gateway debe:
  1. Validar JWT en TODOS los requests
  2. Extraer userId y role del JWT
  3. Agregar headers X-User-Id y X-User-Role
  4. Enrutar a microservicio correspondiente
  5. Aplicar rate limiting
  6. Manejar circuit breaker
  7. Retornar errores consistentes
```

#### Ejemplo de Routing
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://ms-auth:8081
          predicates:
            - Path=/api/auth/**
          filters:
            - StripPrefix=1
        
        - id: students-service
          uri: http://ms-students:8082
          predicates:
            - Path=/api/students/**
          filters:
            - StripPrefix=1
```

---

## ✅ Checklist Final Antes de Hacer un PR

- [ ] Todos los tests pasan (`./mvnw test`)
- [ ] Aplicación compila sin warnings (`./mvnw clean package`)
- [ ] Docker build exitoso
- [ ] docker-compose up funciona
- [ ] Swagger UI accesible y documentado
- [ ] Health check responde OK
- [ ] Logs no tienen ERRORs
- [ ] Variables agregadas a .env.example
- [ ] README.md actualizado
- [ ] ARCHITECTURE.md actualizado si aplica
- [ ] Code review checklist cumplido
- [ ] Commits descriptivos y atómicos

---

## 🆘 ¿Necesitas Ayuda?

### Si eres una IA asistiendo a un desarrollador:

1. **Primero, lee estos archivos:**
   - ARCHITECTURE.md (arquitectura completa)
   - Esta guía (contexto del proyecto)
   - ms-auth/ (ejemplo de referencia)

2. **Cuando te pidan ayuda con un microservicio:**
   - Verifica que estén siguiendo el orden correcto
   - Usa ms-auth como template
   - Asegúrate que entienden JWT y RBAC
   - Valida que el SecurityConfig esté bien
   - Verifica que docker-compose.yml esté actualizado

3. **Patrones a seguir siempre:**
   - Mismo JWT_SECRET para todos los servicios
   - Database per Service (sin acceso cruzado)
   - DTO Pattern (nunca exponer entities)
   - Logging de auditoría
   - Validaciones exhaustivas
   - Tests completos

4. **Red flags (alertar al desarrollador):**
   - JWT_SECRET diferente por servicio
   - Acceso directo a DB de otro servicio
   - Hardcodear configuración
   - No tener tests
   - Exponer stack traces
   - No validar entrada de usuario

---

**Última actualización:** 2026-06-03  
**Versión:** 1.0  
**Mantenedor:** Rodrigo-d1993

---

**¡Bienvenido al proyecto! 🚀**

Si tienes dudas o sugerencias para mejorar esta guía, abre un issue o PR.
