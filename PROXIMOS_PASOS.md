# Próximos Pasos para Completar el Sistema

## Contexto

Actualmente tienes 4 de 5 microservicios base completados y menos de 48 horas para entregar. Este documento detalla los pasos ordenados por prioridad.

## Prioridad 1: Completar ms-annotations (CRÍTICO)

### Objetivo
Tener los 5 microservicios base funcionales para demostrar arquitectura completa.

### Tiempo estimado
40-50 minutos

### Entidades necesarias

**Annotation (Anotación)**
```java
- id: Long
- studentId: Long
- teacherId: Long
- tipo: Enum (POSITIVA, NEGATIVA, NEUTRAL)
- categoria: String (CONDUCTA, RESPONSABILIDAD, PARTICIPACION, etc.)
- descripcion: String
- fecha: LocalDate
- gravedad: Enum (LEVE, GRAVE, MUY_GRAVE) - solo para negativas
- createdAt: LocalDateTime
```

**AnnotationType (Enum)**
- POSITIVA: Felicitaciones, reconocimientos
- NEGATIVA: Faltas disciplinarias
- NEUTRAL: Observaciones generales

**AnnotationSeverity (Enum)**
- LEVE: Atrasos menores, olvido de materiales
- GRAVE: Falta de respeto, disrupciones
- MUY_GRAVE: Agresiones, fraude académico

### Endpoints mínimos

```
POST   /api/annotations                    - Crear anotación (DOCENTE/DIRECTOR)
GET    /api/annotations/{id}               - Obtener por ID
GET    /api/annotations/student/{studentId} - Todas las de un estudiante
GET    /api/annotations/student/{studentId}/type/{tipo} - Por tipo
GET    /api/annotations/teacher/{teacherId} - Todas las de un profesor
PUT    /api/annotations/{id}               - Actualizar (solo creador o DIRECTOR)
DELETE /api/annotations/{id}               - Eliminar (DIRECTOR/ADMIN)
```

### Reglas de negocio

1. Solo DOCENTE y superiores pueden crear anotaciones
2. Gravedad solo aplica a anotaciones NEGATIVA
3. No se pueden modificar anotaciones de otros profesores (excepto DIRECTOR)
4. Estudiantes y apoderados pueden ver pero no modificar

### Configuración necesaria

**Puerto**: 8085
**Base de datos**: db_annotations
**Usuario DB**: annotations_user
**Password DB**: AnnotationsS3cur3P@ss!2024

### Pasos de implementación

1. Copiar estructura de ms-attendance (es el más reciente y completo)
2. Crear entidades: Annotation, AnnotationType, AnnotationSeverity
3. Crear DTOs: AnnotationRequest, AnnotationResponse
4. Crear repositorios con queries:
   - findByStudentIdOrderByFechaDesc
   - findByStudentIdAndTipo
   - findByTeacherId
   - findByFechaBetween
5. Crear servicios con lógica de validación
6. Crear controladores con RBAC
7. Copiar archivos de seguridad (JWT, SecurityConfig)
8. Crear init.sql con 5-10 anotaciones de ejemplo
9. Crear Dockerfile
10. Actualizar .env con variables ANNOTATIONS_*
11. Actualizar docker-compose.yml
12. Compilar: ./mvnw clean compile
13. Crear README.md

### Datos de ejemplo sugeridos

```sql
-- Anotaciones positivas
(1, 1, 5, 'POSITIVA', 'PARTICIPACION', 'Excelente participación en clase', '2024-03-15', NULL)
(2, 1, 5, 'POSITIVA', 'RESPONSABILIDAD', 'Entregó trabajo antes de plazo', '2024-03-18', NULL)

-- Anotaciones negativas
(3, 2, 5, 'NEGATIVA', 'CONDUCTA', 'Interrumpió constantemente la clase', '2024-03-14', 'LEVE')
(4, 2, 6, 'NEGATIVA', 'RESPONSABILIDAD', 'No trajo materiales requeridos', '2024-03-16', 'LEVE')

-- Anotaciones neutrales
(5, 1, 5, 'NEUTRAL', 'GENERAL', 'Mostró mejoría en matemáticas', '2024-03-20', NULL)
```

## Prioridad 2: Testing Básico (RECOMENDADO)

### Objetivo
Asegurar que los microservicios funcionan correctamente.

### Tiempo estimado
20-30 minutos

### Tareas

1. **Levantar todos los servicios**
   ```bash
   docker-compose up -d
   ```

2. **Verificar health checks**
   ```bash
   curl http://localhost:8081/actuator/health  # ms-auth
   curl http://localhost:8082/actuator/health  # ms-students
   curl http://localhost:8083/actuator/health  # ms-grades
   curl http://localhost:8084/actuator/health  # ms-attendance
   curl http://localhost:8085/actuator/health  # ms-annotations
   ```

3. **Test de autenticación**
   ```bash
   # Registrar usuario
   curl -X POST http://localhost:8081/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Test","apellido":"User","email":"test@test.com","password":"Test123!","roleName":"DOCENTE"}'
   
   # Login
   curl -X POST http://localhost:8081/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test123!"}'
   
   # Guardar el token recibido
   ```

4. **Test de cada microservicio**
   - Usar token en header: `Authorization: Bearer {token}`
   - Probar al menos un GET y un POST por microservicio
   - Documentar en archivo TESTING_RESULTS.md

5. **Verificar Swagger UI**
   - http://localhost:8081/swagger-ui.html
   - http://localhost:8082/swagger-ui.html
   - http://localhost:8083/swagger-ui.html
   - http://localhost:8084/swagger-ui.html
   - http://localhost:8085/swagger-ui.html

## Prioridad 3: Documentación Final (CRÍTICO)

### Objetivo
Tener documentación clara para la entrega y evaluación.

### Tiempo estimado
30-40 minutos

### Documentos necesarios

**1. README.md principal (raíz del proyecto)**
Contenido:
- Descripción general del sistema
- Arquitectura (diagrama o descripción)
- Requisitos previos
- Instrucciones de instalación
- Cómo ejecutar el proyecto
- Estructura de carpetas
- Tecnologías utilizadas
- Autores y fecha

**2. MANUAL_INSTALACION.md**
- Paso a paso detallado para instalar
- Configuración de .env
- Comandos Docker
- Verificación de servicios
- Troubleshooting común

**3. MANUAL_USO.md**
- Cómo usar cada microservicio
- Ejemplos de requests con curl/Postman
- Flujos de trabajo típicos
- Roles y permisos

**4. DECISIONES_ARQUITECTONICAS.md**
- Por qué microservicios
- Por qué JWT
- Por qué MySQL
- Por qué Docker
- Trade-offs considerados

**5. Actualizar READMEs de microservicios**
- Remover emojis
- Lenguaje profesional
- Ejemplos claros
- Sin referencias a "IA" o "generado"

## Prioridad 4: Mejoras Opcionales (SI HAY TIEMPO)

### 4A: Validación Cross-Service

**Objetivo**: Verificar que referencias entre servicios son válidas.

**Ejemplo**: En ms-grades, verificar que studentId existe en ms-students.

**Implementación**:
```java
// En GradeServiceImpl
@Value("${students.service.url}")
private String studentsServiceUrl;

private void validateStudent(Long studentId) {
    try {
        ResponseEntity<StudentResponse> response = restTemplate.getForEntity(
            studentsServiceUrl + "/api/students/" + studentId,
            StudentResponse.class
        );
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new IllegalArgumentException("Student not found: " + studentId);
        }
    } catch (Exception e) {
        // Log y continuar o lanzar excepción según lógica de negocio
    }
}
```

**Tiempo estimado**: 20-30 minutos por integración

### 4B: Paginación

**Objetivo**: Mejorar performance en listados grandes.

**Implementación**:
```java
// En Repository
Page<Student> findByCurso(String curso, Pageable pageable);

// En Controller
@GetMapping
public ResponseEntity<Page<StudentResponse>> getStudents(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size
) {
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(studentService.getAllStudents(pageable));
}
```

**Tiempo estimado**: 15-20 minutos por endpoint

### 4C: Filtros Avanzados

**Objetivo**: Búsquedas más específicas.

**Ejemplos**:
- Estudiantes por rango de edad
- Notas por rango de fechas
- Asistencia por mes/año
- Anotaciones por gravedad

**Tiempo estimado**: 10-15 minutos por filtro

### 4D: Reportes Básicos

**Objetivo**: Generar resúmenes útiles.

**Ejemplos**:
- Promedio general de un estudiante (todas las asignaturas)
- Ranking de estudiantes por promedio
- Resumen mensual de asistencia
- Conteo de anotaciones por tipo

**Tiempo estimado**: 20-30 minutos por reporte

### 4E: Exportación a CSV/Excel

**Objetivo**: Permitir descargar datos.

**Librería**: Apache POI o OpenCSV

**Tiempo estimado**: 30-40 minutos por exportación

## Prioridad 5: Frontend Básico (SI HAY TIEMPO Y NO LO HACE EL EQUIPO)

### Objetivo
Interfaz mínima para demostrar funcionalidad.

### Opciones

**Opción A: HTML + JavaScript vanilla**
- Páginas estáticas
- Fetch API para requests
- Sin framework

**Opción B: React básico**
- Create React App
- Componentes simples
- Axios para requests

**Opción C: Postman Collection**
- Colección con todos los endpoints
- Variables de entorno
- Tests automatizados

**Recomendación**: Si el frontend lo hace otro miembro del equipo, enfócate en backend.

**Tiempo estimado**: 2-4 horas (solo si es absolutamente necesario)

## Orden de Ejecución Recomendado

Dado que tienes menos de 48 horas:

### Día 1 (Hoy)
1. Completar ms-annotations (1 hora)
2. Testing básico de los 5 microservicios (30 min)
3. Documentación principal (1 hora)
4. Limpiar READMEs (30 min)
**Total: 3 horas**

### Día 2 (Mañana)
1. MANUAL_INSTALACION.md (30 min)
2. MANUAL_USO.md (30 min)
3. DECISIONES_ARQUITECTONICAS.md (30 min)
4. Si hay tiempo: una mejora opcional (30 min - 1 hora)
5. Testing final completo (1 hora)
6. Preparar presentación/demo (1 hora)
**Total: 4-5 horas**

## Checklist Pre-Entrega

### Código
- [ ] 5 microservicios compilando sin errores
- [ ] Todos los tests de ms-auth pasando
- [ ] Docker Compose funcionando
- [ ] Health checks respondiendo

### Documentación
- [ ] README.md principal completo
- [ ] README.md de cada microservicio actualizado
- [ ] ARQUITECTURA_Y_PATRONES.md revisado
- [ ] MANUAL_INSTALACION.md creado
- [ ] MANUAL_USO.md creado
- [ ] Sin emojis en documentación formal
- [ ] Sin referencias a IA en código/docs

### Seguridad
- [ ] .env en .gitignore
- [ ] Secrets no en el código
- [ ] Passwords hasheados
- [ ] JWT con secret fuerte

### Testing
- [ ] Probados endpoints principales de cada servicio
- [ ] Verificada autenticación JWT
- [ ] Verificados roles y permisos
- [ ] Documentados resultados de tests

### Git
- [ ] Commits descriptivos
- [ ] No archivos sensibles committeados
- [ ] Branch principal estable
- [ ] Tag de versión para entrega

## Comandos Útiles

### Desarrollo
```bash
# Compilar un microservicio
cd ms-{nombre}
./mvnw clean compile

# Ejecutar en desarrollo
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Ver logs de un contenedor
docker logs ms-auth -f

# Reiniciar un servicio
docker-compose restart ms-auth

# Reconstruir un servicio
docker-compose up -d --build ms-auth
```

### Testing
```bash
# Health check todos los servicios
for port in 8081 8082 8083 8084 8085; do
  echo "Service on port $port:"
  curl -s http://localhost:$port/actuator/health | jq .
done

# Ver estado de contenedores
docker-compose ps

# Ver uso de recursos
docker stats
```

### Limpieza
```bash
# Detener todo
docker-compose down

# Limpiar volúmenes
docker-compose down -v

# Limpiar todo y reconstruir
docker-compose down -v
docker-compose up -d --build
```

## Recursos de Referencia

### Spring Boot
- https://spring.io/guides
- https://spring.io/projects/spring-security

### JWT
- https://jwt.io/
- https://github.com/jwtk/jjwt

### Docker
- https://docs.docker.com/compose/

### MySQL
- https://dev.mysql.com/doc/

## Contacto y Soporte

Si necesitas ayuda de otra IA o persona:

1. Comparte estos documentos:
   - ARQUITECTURA_Y_PATRONES.md
   - PROXIMOS_PASOS.md
   - README.md de cada microservicio

2. Explica tu contexto:
   - Proyecto universitario
   - Menos de 48 horas restantes
   - 4 de 5 microservicios completados
   - Necesitas completar ms-annotations

3. Sé específico:
   - "Necesito implementar ms-annotations siguiendo el patrón de ms-attendance"
   - "Necesito crear documentación de instalación"
   - "Necesito probar la integración entre servicios"

## Notas Finales

- **Prioriza funcionalidad sobre perfección**: Es mejor tener 5 servicios básicos funcionando que 4 perfectos.
- **Documenta mientras trabajas**: No dejes la documentación para el final.
- **Prueba frecuentemente**: No esperes a tener todo listo para probar.
- **Commits frecuentes**: Guarda tu progreso regularmente.
- **Pide ayuda temprano**: Si te atascas, busca ayuda inmediatamente.

El sistema está bien encaminado. Con enfoque y priorización adecuada, completarás el proyecto a tiempo.
