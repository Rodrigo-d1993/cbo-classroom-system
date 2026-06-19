# ms-attendance - Control de Asistencia

Microservicio para gestión de asistencia escolar.

## Características

- Estados: PRESENTE, AUSENTE, ATRASADO, JUSTIFICADO
- Cálculo automático de porcentaje
- Sistema de justificaciones con aprobación
- Alertas: OK (>=85%), AT_RISK (70-84%), CRITICAL (<70%)
- Un registro por día por estudiante

## Endpoints

**Attendance**
- POST /api/attendance - Registrar asistencia
- GET /api/attendance/student/{id} - Obtener registros
- GET /api/attendance/student/{id}/summary - Resumen con porcentaje
- PUT /api/attendance/{id} - Actualizar

**Justifications**
- POST /api/justifications - Crear justificación
- PUT /api/justifications/{id}/approve - Aprobar (INSPECTOR, DIRECTOR)
- DELETE /api/justifications/{id}/reject - Rechazar
- GET /api/justifications/pending - Pendientes

## Modelo

**AttendanceRecord**: id, studentId, fecha, status, observacion, registeredBy  
**Justification**: id, attendanceId, motivo, documentoUrl, approved, approvedBy

## Uso

```bash
# Registrar asistencia
POST http://localhost:8084/api/attendance
Authorization: Bearer <token>

{
  "studentId": 1,
  "fecha": "2026-03-15",
  "status": "PRESENTE",
  "registeredBy": 5
}

# Obtener resumen
GET http://localhost:8084/api/attendance/student/1/summary
```

## Cálculo Porcentaje

```
Porcentaje = (PRESENTE + ATRASADO + JUSTIFICADO) / TOTAL × 100
```

Los atrasos y justificados cuentan como asistencia.

## Variables de Entorno

```env
ATTENDANCE_DB_NAME=db_attendance
ATTENDANCE_DB_USER=attendance_user
ATTENDANCE_DB_PASS=<password>
ATTENDANCE_PORT=8084
JWT_SECRET=<shared-secret>
```

## Swagger UI

http://localhost:8084/swagger-ui.html

---

**Desarrollado por**: Rodrigo Delgadillo y Carolina Celis  
**Asignatura**: Desarrollo Fullstack 3  
**Puerto**: 8084
