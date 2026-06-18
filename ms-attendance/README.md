# ms-attendance - Microservicio de Control de Asistencia

Microservicio para la gestión de asistencia escolar en el sistema CBO Classroom. Implementa el control diario de asistencia de estudiantes con cálculo automático de porcentajes y sistema de justificaciones.

## Características Principales

### Sistema de Asistencia Chileno
- **Mínimo requerido**: 85% de asistencia para aprobar el año escolar
- **Estados de asistencia**: PRESENTE, AUSENTE, ATRASADO, JUSTIFICADO
- **Alertas automáticas**: AT_RISK (<85%), CRITICAL (<70%)
- **Sistema de justificaciones**: Con aprobación por INSPECTOR/DIRECTOR

### Funcionalidades
- Registro diario de asistencia por estudiante
- Cálculo automático de porcentajes de asistencia
- Sistema de justificaciones con documentos adjuntos
- Aprobación/rechazo de justificaciones
- Consultas por estudiante, fecha, rango de fechas
- Resúmenes de asistencia con alertas
- Control de duplicados (un registro por día por estudiante)

## Modelo de Datos

### AttendanceRecord (Registro de Asistencia)
```
- id: BIGINT (PK)
- student_id: BIGINT (FK a ms-students)
- fecha: DATE
- status: ENUM (PRESENTE, AUSENTE, ATRASADO, JUSTIFICADO)
- observacion: VARCHAR(500)
- registered_by: BIGINT (ID del docente/inspector)
- created_at: DATETIME
- updated_at: DATETIME
- UNIQUE: (student_id, fecha) - Solo un registro por día
```

### Justification (Justificación de Inasistencia)
```
- id: BIGINT (PK)
- attendance_id: BIGINT (FK a attendance_records)
- motivo: VARCHAR(1000)
- documento_url: VARCHAR(500) - URL del certificado médico
- approved: BOOLEAN
- approved_by: BIGINT (ID del inspector/director)
- approved_at: DATE
- created_at: DATETIME
```

### AttendanceStatus (Enum)
- **PRESENTE**: Asistió a clases
- **AUSENTE**: No asistió sin justificación
- **ATRASADO**: Llegó tarde (cuenta como presente en el porcentaje)
- **JUSTIFICADO**: Inasistencia justificada y aprobada (cuenta como presente)

## Cálculo de Porcentaje de Asistencia

```
Porcentaje = (PRESENTE + ATRASADO + JUSTIFICADO) / TOTAL × 100
```

En Chile, los atrasos y ausencias justificadas **cuentan como asistencia** para el porcentaje mínimo.

### Estados del Resumen
- **OK**: >= 85% de asistencia
- **AT_RISK**: 70-84% de asistencia  
- **CRITICAL**: < 70% de asistencia

## Seguridad y Roles

### Control de Acceso por Endpoint

**Attendance Records**
- `POST /api/attendance`: DOCENTE, INSPECTOR, DIRECTOR, ADMIN_SISTEMA
- `PUT /api/attendance/{id}`: DOCENTE, INSPECTOR, DIRECTOR, ADMIN_SISTEMA
- `DELETE /api/attendance/{id}`: DIRECTOR, ADMIN_SISTEMA
- `GET /api/attendance/**`: Todos los autenticados (ver su propia asistencia)

**Justifications**
- `POST /api/justifications`: APODERADO, INSPECTOR, DIRECTOR, ADMIN_SISTEMA
- `PUT /api/justifications/{id}/approve`: INSPECTOR, DIRECTOR, ADMIN_SISTEMA
- `DELETE /api/justifications/{id}/reject`: INSPECTOR, DIRECTOR, ADMIN_SISTEMA
- `GET /api/justifications/**`: Todos los autenticados

### Autenticación
- JWT compartido con ms-auth
- Token Bearer en header `Authorization`

## API Endpoints

### Attendance Records

**Registrar asistencia**
```http
POST /api/attendance
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": 1,
  "fecha": "2026-03-15",
  "status": "PRESENTE",
  "observacion": null,
  "registeredBy": 5
}
```

**Actualizar registro**
```http
PUT /api/attendance/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": 1,
  "fecha": "2026-03-15",
  "status": "ATRASADO",
  "observacion": "Llegó 10 minutos tarde"
}
```

**Obtener asistencia de un estudiante**
```http
GET /api/attendance/student/{studentId}
Authorization: Bearer {token}
```

**Obtener asistencia por rango de fechas**
```http
GET /api/attendance/student/{studentId}/range?startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer {token}
```

**Obtener asistencia de una fecha específica (todo el curso)**
```http
GET /api/attendance/date/2026-03-15
Authorization: Bearer {token}
```

**Obtener resumen de asistencia (todo el tiempo)**
```http
GET /api/attendance/student/{studentId}/summary
Authorization: Bearer {token}

Response:
{
  "studentId": 1,
  "totalDays": 10,
  "presentDays": 7,
  "absentDays": 2,
  "lateDays": 1,
  "justifiedDays": 0,
  "attendancePercentage": 80.00,
  "status": "AT_RISK"
}
```

**Obtener resumen en rango de fechas**
```http
GET /api/attendance/student/{studentId}/summary/range?startDate=2026-03-01&endDate=2026-03-31
Authorization: Bearer {token}
```

### Justifications

**Crear justificación**
```http
POST /api/justifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "attendanceId": 5,
  "motivo": "Certificado médico - Gripe",
  "documentoUrl": "https://example.com/certificado-001.pdf"
}
```

**Aprobar justificación** (cambia estado de AUSENTE → JUSTIFICADO)
```http
PUT /api/justifications/{id}/approve?approvedBy=3
Authorization: Bearer {token}
```

**Rechazar justificación**
```http
DELETE /api/justifications/{id}/reject
Authorization: Bearer {token}
```

**Obtener justificaciones pendientes**
```http
GET /api/justifications/pending
Authorization: Bearer {token}
```

## Ejecución

### Variables de Entorno Requeridas
```env
ATTENDANCE_DB_NAME=db_attendance
ATTENDANCE_DB_USER=attendance_user
ATTENDANCE_DB_PASS=AttendanceS3cur3P@ss!2026
ATTENDANCE_PORT=8084
JWT_SECRET=qUdDXDq5nH7co/iln7WibkzzVN/Dx85pX591ZUJZtVY=
SPRING_PROFILE=dev
```

### Docker Compose
```bash
docker-compose up db-attendance ms-attendance
```

### Desarrollo Local
```bash
cd ms-attendance
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Compilación
```bash
./mvnw clean package
```

## Datos de Ejemplo

El microservicio incluye 10 registros de asistencia para el estudiante id=1 en marzo 2026:
- 7 días PRESENTE
- 1 día ATRASADO
- 2 días AUSENTE (uno con justificación pendiente)

**Porcentaje actual**: 80% (8/10)  
**Estado**: AT_RISK (necesita 85% mínimo)

## Health Check

```http
GET http://localhost:8084/actuator/health
```

## Documentación API (Swagger)

Una vez iniciado el servicio:
```
http://localhost:8084/swagger-ui.html
```

## Arquitectura

- **Framework**: Spring Boot 3.5.14
- **Java**: 17
- **Base de datos**: MySQL 8.0
- **ORM**: JPA/Hibernate
- **Seguridad**: Spring Security + JWT
- **Documentación**: OpenAPI 3 (Springdoc)

## Integración con otros Microservicios

- **ms-auth**: Autenticación y autorización JWT
- **ms-students**: Referencia a estudiantes mediante studentId
- **Future**: ms-grades (cruzar asistencia con rendimiento académico)

## Flujo de Trabajo Típico

1. **Profesor toma asistencia diaria**
   - Registra PRESENTE/AUSENTE/ATRASADO para cada estudiante
   
2. **Apoderado justifica inasistencia**
   - Crea justificación con motivo y certificado médico
   - Estado queda como pendiente

3. **Inspector/Director revisa justificación**
   - Aprueba: cambia estado a JUSTIFICADO (cuenta como asistencia)
   - Rechaza: elimina justificación, queda como AUSENTE

4. **Sistema calcula porcentajes automáticamente**
   - Genera alertas si cae bajo 85%
   - CRITICAL si cae bajo 70%

## Reglas de Negocio

1. **Un registro por día**: No se puede duplicar asistencia para el mismo estudiante en la misma fecha
2. **Solo ausencias se justifican**: No tiene sentido justificar un día presente
3. **Justificaciones pendientes**: Requieren aprobación explícita
4. **Atrasos cuentan como presentes**: Para el porcentaje de asistencia
5. **Justificados cuentan como presentes**: Una vez aprobados
6. **Fechas pasadas o presentes**: No se puede registrar asistencia futura

## Mejoras Futuras

1. **Notificaciones automáticas**: Alertar a apoderados cuando la asistencia baja del 85%
2. **Reportes mensuales**: PDF con resumen de asistencia
3. **Exportación**: Excel/CSV con datos de asistencia
4. **Integración con calendario escolar**: Días feriados, vacaciones
5. **Asistencia por asignatura**: Control más granular
6. **Geolocalización**: Verificar que el registro se hizo desde el establecimiento
7. **Reconocimiento facial**: Para agilizar la toma de asistencia
8. **Dashboard**: Visualización de tendencias de asistencia

## Troubleshooting

**Error: Attendance already recorded**
- Solo se permite un registro por estudiante por día
- Usar PUT para actualizar en vez de POST

**Error: Can only justify absences**
- Solo se pueden justificar registros con estado AUSENTE
- Verificar el estado antes de crear justificación

**Justification already exists**
- Un registro de asistencia solo puede tener una justificación
- Verificar si ya existe antes de crear nueva

---

**Desarrollado por**: Rodrigo Delgadillo y Carolina Celis  
**Asignatura**: Desarrollo Fullstack 3  
**Puerto**: 8084  
**Swagger**: http://localhost:8084/swagger-ui.html  
**Health Check**: http://localhost:8084/actuator/health
