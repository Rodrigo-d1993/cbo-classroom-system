# 📋 Revisión Completa del Microservicio ms-auth

## 🎯 Resumen Ejecutivo

El microservicio **ms-auth** tiene una base sólida con Spring Boot, Spring Security y JWT. Sin embargo, hay **áreas críticas** que necesitan mejoras antes de construir los demás microservicios para garantizar seguridad, escalabilidad y mantenibilidad.

---

## 🔴 PROBLEMAS CRÍTICOS (Prioridad Alta)

### 1. **Seguridad de Credenciales**

#### ❌ Problema Actual
```env
# .env (COMMITED - MAL)
JWT_SECRET=cambia_esto_en_produccion_min_256_bits_base64
MYSQL_ROOT_PASSWORD=rootpassword
```

**Riesgos:**
- El `.env` está versionado en Git (no está en `.gitignore`)
- JWT_SECRET débil y predecible
- Contraseñas en texto plano

#### ✅ Solución Recomendada
1. Asegurar que `.env` está en `.gitignore` (ya lo está, pero verificar que no se haya commiteado)
2. Generar secretos fuertes:
```bash
# Generar JWT_SECRET seguro (base64, 256 bits)
openssl rand -base64 32

# O usar un generador UUID fuerte
uuidgen | base64
```

3. Para producción, usar **AWS Secrets Manager**, **HashiCorp Vault** o variables de entorno del orquestador

---

### 2. **Validación de JWT Secret Insuficiente**

#### ❌ Problema Actual
```java
// JwtService.java
private Key getSigningKey() {
    byte[] keyBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
    return Keys.hmacShaKeyFor(keyBytes); // ¡Puede fallar si secret < 32 bytes!
}
```

**Riesgo:** Si el secret es menor a 256 bits (32 bytes), `Keys.hmacShaKeyFor()` lanza excepción en runtime.

#### ✅ Solución
```java
@PostConstruct
public void validateSecret() {
    if (jwtProperties.getSecret() == null || 
        jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8).length < 32) {
        throw new IllegalStateException(
            "JWT secret must be at least 256 bits (32 bytes). Current length: " 
            + jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8).length
        );
    }
}
```

---

### 3. **Falta Validación de Tokens Expirados**

#### ❌ Problema Actual
```java
public boolean isTokenValid(String token) {
    try {
        parseClaims(token);
        return true; // No valida expiración explícitamente
    } catch (JwtException | IllegalArgumentException e) {
        return false;
    }
}
```

#### ✅ Solución
```java
public boolean isTokenValid(String token) {
    try {
        Claims claims = parseClaims(token);
        return claims.getExpiration().after(new Date()); // Validar expiración
    } catch (ExpiredJwtException e) {
        return false; // Token expirado
    } catch (JwtException | IllegalArgumentException e) {
        return false; // Otros errores
    }
}
```

---

### 4. **SecurityConfig: Endpoints Sin Protección Adecuada**

#### ❌ Problema Actual
```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/auth/login", "/auth/refresh").permitAll()
    .anyRequest().authenticated() // /auth/users está protegido pero sin roles
)
```

**Problemas:**
- **POST /auth/users** (registro) está autenticado pero debería ser público O restringido a ADMIN
- **GET /auth/users** (listar todos) no tiene control de roles
- **PATCH /auth/users/{id}/role** puede ser llamado por cualquier usuario autenticado
- Falta CORS configuration
- Falta protección contra ataques de timing

#### ✅ Solución Recomendada
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            // Públicos
            .requestMatchers(
                "/auth/login", 
                "/auth/refresh",
                "/actuator/health",
                "/v3/api-docs/**",
                "/swagger-ui/**"
            ).permitAll()
            
            // Solo ADMIN puede registrar usuarios y gestionar roles
            .requestMatchers(HttpMethod.POST, "/auth/users").hasRole("ADMIN_SISTEMA")
            .requestMatchers(HttpMethod.GET, "/auth/users").hasRole("ADMIN_SISTEMA")
            .requestMatchers(HttpMethod.PATCH, "/auth/users/*/role").hasRole("ADMIN_SISTEMA")
            .requestMatchers(HttpMethod.DELETE, "/auth/users/*").hasRole("ADMIN_SISTEMA")
            
            // Usuarios autenticados pueden ver su perfil
            .requestMatchers(HttpMethod.GET, "/auth/users/me").authenticated()
            
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Frontend
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

### 5. **Problema con @PreAuthorize**

Para que funcione `hasRole()`, necesitas configurar roles correctamente:

```java
// JwtAuthenticationFilter.java - Agregar authorities al SecurityContext
UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
    userDetails, 
    null, 
    userDetails.getAuthorities() // ¡CRÍTICO! Incluir authorities
);
```

---

## 🟠 PROBLEMAS IMPORTANTES (Prioridad Media)

### 6. **Falta Rate Limiting**

Sin protección contra ataques de fuerza bruta en `/auth/login`.

#### ✅ Solución con Bucket4j
```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.github.vladimir-bukhtoyarov</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>8.1.0</version>
</dependency>
```

```java
@Component
public class RateLimitFilter extends OncePerRequestFilter {
    
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String ip = request.getRemoteAddr();
        Bucket bucket = cache.computeIfAbsent(ip, this::createBucket);
        
        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429); // Too Many Requests
            response.getWriter().write("{\"error\":\"Too many requests\"}");
        }
    }
    
    private Bucket createBucket(String key) {
        return Bucket.builder()
            .addLimit(Bandwidth.simple(10, Duration.ofMinutes(1))) // 10 req/min
            .build();
    }
}
```

---

### 7. **Logging Inadecuado**

#### ❌ Problema
- No hay logs de intentos de login fallidos
- No hay auditoría de cambios de roles
- No hay tracking de tokens generados

#### ✅ Solución
```java
@Slf4j
@Service
public class AuthServiceImpl implements AuthService {
    
    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );
            
            log.info("Successful login for user: {}", request.getUsername());
            // ... resto del código
            
        } catch (AuthenticationException e) {
            log.warn("Failed login attempt for user: {}", request.getUsername());
            throw e;
        }
    }
}
```

---

### 8. **Falta Refresh Token Seguro**

#### ❌ Problema Actual
El endpoint `/auth/refresh` acepta el mismo token de acceso, lo cual no es seguro.

#### ✅ Solución: Implementar Refresh Token separado
1. Crear tabla `refresh_tokens` en base de datos
2. Generar refresh token de larga duración (7-30 días)
3. Access token de corta duración (15 min - 1 hora)
4. Endpoint `/auth/refresh` valida refresh token y genera nuevo access token

---

### 9. **Docker: Falta Multi-Stage Optimizado**

#### ❌ Problema Actual
```dockerfile
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -q  # ❌ No cacheará si cambia pom.xml
```

#### ✅ Solución Mejorada
```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Layer de dependencias (cacheable)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:resolve -B

# Layer de código fuente
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# Imagen final
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Usuario no-root para seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /app/target/ms-auth.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

EXPOSE 8081
ENTRYPOINT ["java", "-Xmx256m", "-Xms128m", "-jar", "app.jar"]
```

---

### 10. **docker-compose: Faltan Configuraciones de Producción**

#### ✅ Mejoras Recomendadas
```yaml
services:
  db-auth:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: ${AUTH_DB_NAME}
      MYSQL_USER: ${AUTH_DB_USER}
      MYSQL_PASSWORD: ${AUTH_DB_PASS}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - db_auth_data:/var/lib/mysql
      - ./ms-auth/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u${AUTH_DB_USER}", "-p${AUTH_DB_PASS}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped  # ✅ Restart policy
    networks:
      - backend
    # ✅ Límites de recursos
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  ms-auth:
    build: ./ms-auth
    ports:
      - "${AUTH_PORT}:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db-auth:3306/${AUTH_DB_NAME}?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: ${AUTH_DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${AUTH_DB_PASS}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION_MS: ${JWT_EXPIRATION_MS}
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILE:-prod}  # ✅ Profile explícito
    depends_on:
      db-auth:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:  # ✅ Health check del servicio
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8081/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - backend
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

---

## 🟡 MEJORAS RECOMENDADAS (Prioridad Baja)

### 11. **Validaciones de Contraseña Débiles**

#### ✅ Agregar validación robusta
```java
@NotBlank(message = "Password is required")
@Pattern(
    regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    message = "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
)
private String password;
```

---

### 12. **Falta Auditoría de Entidades**

#### ✅ Implementar JPA Auditing
```java
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public abstract class AuditableEntity {
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;
    
    @LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;
}

// Habilitar en configuración
@EnableJpaAuditing
@Configuration
public class JpaConfig {
    
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
            .map(SecurityContext::getAuthentication)
            .filter(Authentication::isAuthenticated)
            .map(Authentication::getName);
    }
}
```

---

### 13. **Migrations con Flyway/Liquibase**

En lugar de `init.sql`, usar herramientas de migración profesionales:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

```properties
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
```

Crear: `src/main/resources/db/migration/V1__Initial_schema.sql`

---

### 14. **application.properties: Separar por Profiles**

#### ✅ Estructura Recomendada
```
src/main/resources/
├── application.properties          # Configuración común
├── application-dev.properties      # Desarrollo
├── application-test.properties     # Testing
└── application-prod.properties     # Producción
```

```properties
# application.properties
spring.application.name=ms-auth
server.port=8081

# application-prod.properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.root=WARN
logging.level.com.bookclass.ms_auth=INFO

# application-dev.properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
logging.level.root=INFO
logging.level.com.bookclass.ms_auth=DEBUG
```

---

### 15. **Actuator: Exponer Métricas con Seguridad**

```properties
# Exponer endpoints útiles
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=when-authorized

# Seguridad en actuator
management.endpoints.web.base-path=/actuator
management.security.enabled=true
```

Proteger en SecurityConfig:
```java
.requestMatchers("/actuator/health").permitAll()
.requestMatchers("/actuator/**").hasRole("ADMIN_SISTEMA")
```

---

### 16. **Tests: Mejorar Cobertura**

Revisar tests existentes y agregar:
- Tests de integración con Testcontainers
- Tests de seguridad (intentos de acceso no autorizado)
- Tests de performance (rate limiting)

---

## 📦 DEPENDENCIAS RECOMENDADAS PARA AGREGAR

```xml
<!-- Observabilidad -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>

<!-- Migrations -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>

<!-- Rate Limiting -->
<dependency>
    <groupId>com.github.vladimir-bukhtoyarov</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>8.1.0</version>
</dependency>

<!-- Validaciones avanzadas -->
<dependency>
    <groupId>org.passay</groupId>
    <artifactId>passay</artifactId>
    <version>1.6.4</version>
</dependency>

<!-- Testing avanzado -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>mysql</artifactId>
    <scope>test</scope>
</dependency>
```

---

## 🏗️ RECOMENDACIONES PARA MICROSERVICIOS FUTUROS

### 1. **Service Discovery**
Implementar Eureka Server o Consul para registro de servicios

### 2. **API Gateway**
- Spring Cloud Gateway en `ms-gateway`
- Centralizar autenticación JWT
- Rate limiting global
- Circuit breaker con Resilience4j

### 3. **Configuración Centralizada**
- Spring Cloud Config Server
- Externalizar configuración sensible

### 4. **Mensajería Asíncrona**
- RabbitMQ o Kafka para comunicación entre microservicios
- Eventos de dominio (UserCreatedEvent, RoleChangedEvent)

### 5. **Distributed Tracing**
- Spring Cloud Sleuth + Zipkin
- Rastreo de requests entre servicios

### 6. **Patrón Database per Service**
- Cada microservicio debe tener su propia BD
- No compartir esquemas entre servicios

---

## ✅ CHECKLIST DE ACCIÓN INMEDIATA

```markdown
### Seguridad Crítica
- [ ] Regenerar JWT_SECRET con >= 32 bytes aleatorios
- [ ] Verificar que .env no está en Git
- [ ] Implementar validación de JWT secret al inicio
- [ ] Agregar control de roles en endpoints sensibles
- [ ] Implementar rate limiting en /auth/login

### Docker & Deployment
- [ ] Optimizar Dockerfile con usuario no-root
- [ ] Agregar health checks en docker-compose
- [ ] Configurar resource limits
- [ ] Agregar restart policies

### Código & Testing
- [ ] Validar expiración de tokens explícitamente
- [ ] Agregar logs de auditoría (login, cambios de rol)
- [ ] Implementar refresh tokens seguros
- [ ] Mejorar cobertura de tests

### Configuración
- [ ] Migrar a Flyway para gestión de esquema
- [ ] Separar properties por profiles (dev/test/prod)
- [ ] Configurar CORS apropiadamente
- [ ] Asegurar endpoints de Actuator

### Documentación
- [ ] Documentar flujo de autenticación
- [ ] Crear guía de deployment
- [ ] Documentar variables de entorno requeridas
```

---

## 🎓 CONCLUSIÓN

El microservicio **ms-auth** tiene una base funcional, pero requiere mejoras de seguridad críticas antes de producción. Las recomendaciones priorizadas te permitirán construir los demás microservicios sobre una base sólida y segura.

**Próximos pasos sugeridos:**
1. Implementar las correcciones de seguridad críticas (Sección 🔴)
2. Aplicar mejoras de Docker y configuración (Sección 🟠)
3. Construir `ms-gateway` con autenticación centralizada
4. Implementar service discovery antes de agregar más microservicios
5. Establecer patrones de comunicación (sync REST vs async messaging)
