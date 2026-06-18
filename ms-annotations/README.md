# ms-annotations - Microservicio de Anotaciones Disciplinarias

Microservicio para la gestión de anotaciones de comportamiento y disciplina escolar en el sistema CBO Classroom. Permite registrar observaciones positivas, negativas y neutrales sobre el desempeño conductual de los estudiantes.

## Características Principales

### Sistema de Anotaciones
- Tres tipos de anotaciones: POSITIVA, NEGATIVA, NEUTRAL
- Niveles de gravedad para anotaciones negativas: LEVE, GRAVE, MUY_GRAVE
- Categorización flexible (CONDUCTA, RESPONSABILIDAD, PARTICIPACION, etc.)
- Tracking del profesor que registra la anotación
- Cálculo automático de comportamiento general del estudiante

### Funcionalidades
- Registro de anotaciones por estudiante
- Consulta de historial completo por estudiante
- Filtrado por tipo de anotación
- Consulta de anotaciones por profesor
- Resumen de comportamiento con clasificación automática
- Búsqueda por rangos de fechas
- Actualización y eliminación con control de permisos

## Modelo de Datos

### Annotation (Anotación)
```
- id: BIGINT (PK)
- student_id: BIGINT (FK a ms-students)
- teacher_id: BIGINT (FK a ms-auth users)
- tipo: ENUM (POSITIVA, NEGATIVA, NEUTRAL)
- categoria: VARCHAR(100)
- descripcion: VARCHAR(1000)
- fecha: DATE
- gravedad: ENUM (LEVE, GRAVE, MUY_GRAVE) - solo para NEGATIVA
- created_at: DATETIME
- updated_at: DATETIME
```

### AnnotationType (Enum)
- **POSITIVA**: Felicitaciones, reconocimientos, logros
- **NEGATIVA**: Faltas disciplinarias, comportamiento inadecuado
- **NEUTRAL**: Observaciones generales sin valoración

### AnnotationSeverity (Enum)
- **LEVE**: Atrasos menores, olvido de materiales, conversación en clase
- **GRAVE**: Falta de respeto, disrupciones repetidas, incumplimiento de normas
- **MUY_GRAVE**: Agresiones, fraude académico, faltas muy graves

## Cálculo de Comportamiento

El sistema calcula automáticamente el comportamiento general basándose en:

```
Balance = POSITIVAS - NEGATIVAS - (GRAVES × 2)

Si tiene MUY_GRAVE → MALO (automático)
Balance >= 3 → EXCELENTE
Balance >= 0 → BUENO
Balance >= -3 → REGULAR
Balance < -3 → MALO
```

## Seguridad y Roles

### Control de Acceso por Endpoint

**Annotations**
- `POST /api/annotations`: DOCENTE, INSPECTOR, DIRECTOR, ADMIN_SISTEMA
- `PUT /api/annotations/{id}`: DIRECTOR, ADMIN_SISTEMA (solo ellos pueden modificar)
- `DELETE /api/annotations/{id}`: DIRECTOR, ADMIN_SISTEMA
- `GET /api/annotations/**`: Todos los autenticados (ver información relevante)

### Regla de Negocio Importante
- Gravedad SOLO puede especificarse en anotaciones de tipo NEGATIVA
- Gravedad es OBLIGATORIA para anotaciones de tipo NEGATIVA
- Validación automática en el backend

## API Endpoints

### Crear anotación
```http
POST /api/annotations
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": 1,
  "teacherId": 5,
  "tipo": "POSITIVA",
  "categoria": "PARTICIPACION",
  "descripcion": "Excelente participación en clase",
  "fecha": "2024-03-15"
}
```

### Crear anotación negativa (con gravedad)
```http
POST /api/annotations
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": 2,
  "teacherId": 5,
  "tipo": "NEGATIVA",
  "categoria": "CONDUCTA",
  "descripcion": "Falta de respeto hacia compañero",
  "fecha": "2024-03-15",
  "gravedad": "GRAVE"
}
```

### Obtener anotaciones de un estudiante
```http
GET /api/annotations/student/{studentId}
Authorization: Bearer {token}
```

### Obtener anotaciones por tipo
```http
GET /api/annotations/student/{studentId}/type/POSITIVA
Authorization: Bearer {token}
```

### Obtener resumen de comportamiento
```http
GET /api/annotations/student/{studentId}/summary
Authorization: Bearer {token}

Response:
{
  "studentId": 1,
  "totalAnnotations": 5,
  "positiveCount": 3,
  "negativeCount": 2,
  "neutralCount": 0,
  "leveCount": 2,
  "graveCount": 0,
  "muyGraveCount": 0,
  "comportamiento": "BUENO"
}
```

### Obtener anotaciones por rango de fechas
```http
GET /api/annotations/student/{studentId}/range?startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer {token}
```

### Obtener anotaciones registradas por un profesor
```http
GET /api/annotations/teacher/{teacherId}
Authorization: Bearer {token}
```

## Ejecución

### Variables de Entorno Requeridas
```env
ANNOTATIONS_DB_NAME=db_annotations
ANNOTATIONS_DB_USER=annotations_user
ANNOTATIONS_DB_PASS=AnnotationsS3cur3P@ss!2024
ANNOTATIONS_PORT=8085
JWT_SECRET=qUdDXDq5nH7co/iln7WibkzzVN/Dx85pX591ZUJZtVY=
SPRING_PROFILE=dev
```

### Docker Compose
```bash
docker-compose up db-annotations ms-annotations
```

### Desarrollo Local
```bash
cd ms-annotations
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Compilación
```bash
./mvnw clean package
```

## Datos de Ejemplo

El microservicio incluye 9 anotaciones de ejemplo:

**Estudiante ID=1 (Comportamiento EXCELENTE)**
- 3 anotaciones POSITIVAS (participación, responsabilidad, colaboración)

**Estudiante ID=2 (Comportamiento MALO)**
- 3 anotaciones NEGATIVAS (2 LEVE, 1 GRAVE)

**Estudiante ID=3**
- 1 anotación NEUTRAL (observación general)

**Estudiante ID=4 (Comportamiento MALO)**
- 1 anotación NEGATIVA MUY_GRAVE (intento de copia en evaluación)

## Health Check

```http
GET http://localhost:8085/actuator/health
```

## Documentación API (Swagger)

Una vez iniciado el servicio:
```
http://localhost:8085/swagger-ui.html
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
- **Future**: Integración para validar que studentId y teacherId existen

## Categorías Comunes de Anotaciones

### Positivas
- PARTICIPACION: Contribuciones activas en clase
- RESPONSABILIDAD: Cumplimiento de tareas y compromisos
- COLABORACION: Ayuda a compañeros
- LIDERAZGO: Iniciativa y guía al grupo
- LOGRO: Reconocimientos especiales

### Negativas
- CONDUCTA: Comportamiento inadecuado
- RESPONSABILIDAD: Incumplimiento de deberes
- RESPETO: Faltas de consideración
- DISCIPLINA: Violación de normas
- ACADEMICO: Deshonestidad académica

### Neutrales
- GENERAL: Observaciones sin juicio de valor
- OBSERVACION: Notas sobre el proceso del estudiante
- SEGUIMIENTO: Comentarios de seguimiento

## Reglas de Negocio

1. Gravedad solo aplica a anotaciones NEGATIVA
2. Gravedad es obligatoria para anotaciones NEGATIVA
3. Fecha no puede ser futura
4. Solo DIRECTOR puede modificar anotaciones de otros profesores
5. Descripción máximo 1000 caracteres
6. Categoría máximo 100 caracteres

## Mejoras Futuras (Opcionales)

1. Notificaciones automáticas a apoderados por anotaciones graves
2. Reportes periódicos de comportamiento
3. Exportación de historial en PDF
4. Firmas digitales de apoderados
5. Integración con sistema de premiación
6. Dashboard de tendencias de comportamiento por curso
7. Plantillas predefinidas de anotaciones comunes
8. Adjuntar evidencias (fotos, documentos)

## Troubleshooting

**Error: Gravedad solo puede ser especificada para anotaciones NEGATIVA**
- No se puede asignar gravedad a anotaciones POSITIVA o NEUTRAL
- Verificar que tipo sea NEGATIVA antes de asignar gravedad

**Error: Gravedad es obligatoria para anotaciones NEGATIVA**
- Todas las anotaciones NEGATIVA deben tener gravedad
- Especificar LEVE, GRAVE o MUY_GRAVE

**Error: Fecha cannot be in the future**
- Solo se pueden registrar anotaciones de fechas pasadas o presentes
- Verificar formato de fecha (YYYY-MM-DD)

## Versión
v0.0.1-SNAPSHOT
