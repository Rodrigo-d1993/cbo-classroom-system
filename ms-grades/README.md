# ms-grades - Gestión de Calificaciones

Microservicio para el sistema de notas chileno (escala 1.0-7.0).

## Características

- Rango: 1.0 a 7.0
- Aprobación: >= 4.0
- Tipos: PRUEBA, EXAMEN, TRABAJO, CONTROL, etc.
- Cálculo automático de promedios

## Endpoints

**Subjects**
- GET /api/subjects - Listar asignaturas
- POST /api/subjects - Crear asignatura (DOCENTE, DIRECTOR, ADMIN)
- PUT /api/subjects/{id} - Actualizar
- DELETE /api/subjects/{id} - Desactivar

**Grades**
- POST /api/grades - Registrar nota (DOCENTE, DIRECTOR)
- GET /api/grades/student/{id} - Notas de estudiante
- GET /api/grades/student/{id}/subject/{subjectId}/average - Promedio

## Modelo

**Subject**: id, nombre, codigo, descripcion  
**Grade**: id, studentId, subjectId, nota, tipo, fecha, observacion, teacherId

## Uso

```bash
# Registrar nota
POST http://localhost:8083/api/grades
Authorization: Bearer <token>

{
  "studentId": 1,
  "subjectId": 1,
  "nota": 6.5,
  "tipo": "PRUEBA",
  "fecha": "2026-03-15",
  "observacion": "Buen desempeño",
  "teacherId": 5
}
```

## Variables de Entorno

```env
GRADES_DB_NAME=db_grades
GRADES_DB_USER=grades_user
GRADES_DB_PASS=<password>
GRADES_PORT=8083
JWT_SECRET=<shared-secret>
```

## Datos Precargados

8 asignaturas: Matemática, Lenguaje, Historia, Ciencias, Inglés, Ed. Física, Artes, Música

## Swagger UI

http://localhost:8083/swagger-ui.html

---

**Desarrollado por**: Rodrigo Delgadillo y Carolina Celis  
**Asignatura**: Desarrollo Fullstack 3  
**Puerto**: 8083
