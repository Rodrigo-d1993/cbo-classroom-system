# ms-students - Gestión de Estudiantes

Microservicio para gestión de estudiantes y apoderados.

## Funcionalidades

- CRUD de estudiantes con validación de RUT chileno
- Búsqueda por RUT y filtrado por curso
- Gestión de apoderados (relación many-to-many)
- Control de acceso por roles

## Endpoints

| Método | Endpoint | Rol Requerido |
|--------|----------|---------------|
| POST | /students | ADMIN, DIRECTOR |
| GET | /students | ADMIN, DIRECTOR, DOCENTE, INSPECTOR |
| GET | /students/{id} | Autenticado |
| GET | /students/rut/{rut} | ADMIN, DIRECTOR, DOCENTE, INSPECTOR |
| PUT | /students/{id} | ADMIN, DIRECTOR |
| DELETE | /students/{id} | ADMIN, DIRECTOR |

## Modelo

**Student**: id, rut, nombre, apellido, email, fechaNacimiento, curso, active  
**Guardian**: id, rut, nombre, apellido, email, telefono, relacion

## Uso

```bash
# Crear estudiante
POST http://localhost:8082/api/students
Authorization: Bearer <token>

{
  "rut": "20123456-7",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@estudiante.cl",
  "fechaNacimiento": "2008-03-15",
  "curso": "3° Medio A"
}
```

## Variables de Entorno

```env
STUDENTS_DB_NAME=db_students
STUDENTS_DB_USER=students_user
STUDENTS_DB_PASS=<password>
STUDENTS_PORT=8082
JWT_SECRET=<shared-secret>
```

## Swagger UI

http://localhost:8082/swagger-ui.html

---

**Desarrollado por**: Rodrigo Delgadillo y Carolina Celis  
**Asignatura**: Desarrollo Fullstack 3  
**Puerto**: 8082
