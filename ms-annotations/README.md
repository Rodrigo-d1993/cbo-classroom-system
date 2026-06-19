# ms-annotations - Anotaciones Disciplinarias

Microservicio para anotaciones de comportamiento y disciplina.

## Características

- Tipos: POSITIVA, NEGATIVA, NEUTRAL
- Gravedad (solo negativas): LEVE, GRAVE, MUY_GRAVE
- Cálculo automático de comportamiento
- Categorización flexible

## Endpoints

- POST /api/annotations - Registrar anotación (DOCENTE, INSPECTOR, DIRECTOR)
- GET /api/annotations/student/{id} - Historial de estudiante
- GET /api/annotations/student/{id}/type/{type} - Filtrar por tipo
- GET /api/annotations/student/{id}/summary - Resumen con comportamiento
- GET /api/annotations/teacher/{teacherId} - Anotaciones por profesor
- PUT /api/annotations/{id} - Actualizar (DIRECTOR, ADMIN)
- DELETE /api/annotations/{id} - Eliminar (DIRECTOR, ADMIN)

## Modelo

**Annotation**: id, studentId, teacherId, tipo, categoria, descripcion, fecha, gravedad

## Cálculo de Comportamiento

```
Balance = POSITIVAS - NEGATIVAS - (GRAVES × 2)

MUY_GRAVE presente → MALO
Balance >= 3 → EXCELENTE
Balance >= 0 → BUENO
Balance >= -3 → REGULAR
Balance < -3 → MALO
```

## Uso

```bash
# Anotación positiva
POST http://localhost:8085/api/annotations
Authorization: Bearer <token>

{
  "studentId": 1,
  "teacherId": 5,
  "tipo": "POSITIVA",
  "categoria": "PARTICIPACION",
  "descripcion": "Excelente participación en clase",
  "fecha": "2026-03-15"
}

# Anotación negativa (requiere gravedad)
{
  "studentId": 2,
  "teacherId": 5,
  "tipo": "NEGATIVA",
  "categoria": "CONDUCTA",
  "descripcion": "Falta de respeto",
  "fecha": "2026-03-15",
  "gravedad": "GRAVE"
}
```

## Reglas

- Gravedad SOLO para anotaciones NEGATIVA
- Gravedad OBLIGATORIA para anotaciones NEGATIVA
- Solo DIRECTOR puede modificar anotaciones de otros profesores

## Variables de Entorno

```env
ANNOTATIONS_DB_NAME=db_annotations
ANNOTATIONS_DB_USER=annotations_user
ANNOTATIONS_DB_PASS=<password>
ANNOTATIONS_PORT=8085
JWT_SECRET=<shared-secret>
```

## Swagger UI

http://localhost:8085/swagger-ui.html

---

**Desarrollado por**: Rodrigo Delgadillo y Carolina Celis  
**Asignatura**: Desarrollo Fullstack 3  
**Puerto**: 8085
