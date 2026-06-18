# ms-grades - Microservicio de Gestión de Notas

Microservicio para la gestión de calificaciones académicas en el sistema CBO Classroom. Implementa el sistema chileno de notas (1.0 - 7.0) con cálculo automático de promedios y determinación de situación académica (aprobado/reprobado).

## Características Principales

### Sistema de Calificaciones Chileno
- **Rango de notas**: 1.0 a 7.0
- **Nota de aprobación**: 4.0
- **Redondeo**: Automático con precisión decimal (ej: 5.45 → 5.5)
- **Situación académica**: APROBADO (≥4.0) / REPROBADO (<4.0)

### Funcionalidades
- Gestión de asignaturas (Matemática, Lenguaje, Historia, etc.)
- Registro de notas por estudiante y asignatura
- Múltiples tipos de evaluación (PRUEBA, EXAMEN, TRABAJO, etc.)
- Cálculo automático de promedios por asignatura
- Consulta de notas por estudiante o asignatura
- Validación de rango de notas (1.0-7.0)
- Observaciones y comentarios en cada nota
- Tracking del profesor que registró la nota

## Modelo de Datos

### Subject (Asignatura)
```
- id: BIGINT (PK)
- nombre: VARCHAR(100)
- codigo: VARCHAR(10) UNIQUE (ej: MAT, LEN, HIS)
- descripcion: VARCHAR(255)
- active: BOOLEAN
- created_at: DATETIME
```

### Grade (Nota)
```
- id: BIGINT (PK)
- student_id: BIGINT (FK a ms-students)
- subject_id: BIGINT (FK a subjects)
- nota: DECIMAL(3,1) CHECK (1.0 - 7.0)
- tipo: VARCHAR(50) (PRUEBA, EXAMEN, etc.)
- fecha: DATE
- observacion: VARCHAR(500)
- teacher_id: BIGINT
- created_at: DATETIME
```

### GradeType (Enum)
- PRUEBA
- TRABAJO
- EXAMEN
- CONTROL
- DISERTACION
- LABORATORIO
- PARTICIPACION
- OTRO

## Seguridad y Roles

### Control de Acceso por Endpoint

**Subjects (Asignaturas)**
- `GET /api/subjects/**`: Todos los usuarios autenticados
- `POST /api/subjects/**`: DOCENTE, DIRECTOR, ADMIN_SISTEMA
- `PUT /api/subjects/**`: DOCENTE, DIRECTOR, ADMIN_SISTEMA
- `DELETE /api/subjects/**`: DIRECTOR, ADMIN_SISTEMA

**Grades (Notas)**
- `GET /api/grades/**`: Todos los usuarios autenticados (ver sus propias notas)
- `POST /api/grades/**`: DOCENTE, DIRECTOR
- `PUT /api/grades/**`: DOCENTE, DIRECTOR
- `DELETE /api/grades/**`: DIRECTOR, ADMIN_SISTEMA

### Autenticación
- JWT compartido con ms-auth
- Token Bearer en header `Authorization`
- Validación de secret mínimo 256 bits

## API Endpoints

### Subjects

**Crear asignatura**
```http
POST /api/subjects
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Matemática",
  "codigo": "MAT",
  "descripcion": "Matemática general"
}
```

**Listar asignaturas activas**
```http
GET /api/subjects
Authorization: Bearer {token}
```

**Obtener asignatura por ID**
```http
GET /api/subjects/{id}
Authorization: Bearer {token}
```

**Actualizar asignatura**
```http
PUT /api/subjects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Matemática Avanzada",
  "codigo": "MAT",
  "descripcion": "Matemática nivel avanzado"
}
```

**Desactivar asignatura**
```http
DELETE /api/subjects/{id}
Authorization: Bearer {token}
```

### Grades

**Registrar nota**
```http
POST /api/grades
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": 1,
  "subjectId": 1,
  "nota": 6.5,
  "tipo": "PRUEBA",
  "fecha": "2024-03-15",
  "observacion": "Prueba de funciones",
  "teacherId": 5
}
```

**Obtener notas de un estudiante**
```http
GET /api/grades/student/{studentId}
Authorization: Bearer {token}
```

**Obtener notas de un estudiante en una asignatura**
```http
GET /api/grades/student/{studentId}/subject/{subjectId}
Authorization: Bearer {token}
```

**Obtener promedio de un estudiante en una asignatura**
```http
GET /api/grades/student/{studentId}/subject/{subjectId}/average
Authorization: Bearer {token}

Response:
{
  "studentId": 1,
  "subjectId": 1,
  "average": 6.2,
  "situacion": "APROBADO",
  "gradeCount": 3
}
```

**Actualizar nota**
```http
PUT /api/grades/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nota": 6.8,
  "tipo": "PRUEBA",
  "fecha": "2024-03-15",
  "observacion": "Nota corregida"
}
```

**Eliminar nota**
```http
DELETE /api/grades/{id}
Authorization: Bearer {token}
```

## Ejecución

### Variables de Entorno Requeridas
```env
GRADES_DB_NAME=db_grades
GRADES_DB_USER=grades_user
GRADES_DB_PASS=GradesS3cur3P@ss!2024
GRADES_PORT=8083
JWT_SECRET=qUdDXDq5nH7co/iln7WibkzzVN/Dx85pX591ZUJZtVY=
SPRING_PROFILE=dev
```

### Docker Compose
```bash
docker-compose up db-grades ms-grades
```

### Desarrollo Local
```bash
cd ms-grades
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Compilación
```bash
./mvnw clean package
```

## Datos de Ejemplo

El microservicio incluye 8 asignaturas precargadas:
1. Matemática (MAT)
2. Lenguaje y Comunicación (LEN)
3. Historia y Geografía (HIS)
4. Ciencias Naturales (CIE)
5. Inglés (ING)
6. Educación Física (EFI)
7. Artes Visuales (ART)
8. Música (MUS)

También incluye 5 notas de ejemplo para el estudiante con id=1.

## Health Check

```http
GET http://localhost:8083/actuator/health
```

## Documentación API (Swagger)

Una vez iniciado el servicio:
```
http://localhost:8083/swagger-ui.html
```

## Arquitectura

- **Framework**: Spring Boot 3.5.14
- **Java**: 17
- **Base de datos**: MySQL 8.0
- **ORM**: JPA/Hibernate
- **Seguridad**: Spring Security + JWT
- **Documentación**: OpenAPI 3 (Springdoc)
- **Logs**: SLF4J + Logback

## Integración con otros Microservicios

- **ms-auth**: Autenticación y autorización JWT
- **ms-students**: Referencia a estudiantes mediante studentId
- **Future**: ms-attendance, ms-annotations

## Notas de Desarrollo

- Las notas se validan automáticamente en rango 1.0-7.0 a nivel de base de datos
- El promedio se calcula con precisión decimal usando BigDecimal
- La situación académica se determina automáticamente (≥4.0 = APROBADO)
- Los índices en student_id y subject_id optimizan consultas frecuentes
- El microservicio NO almacena datos de estudiantes, solo referencias por ID

## Troubleshooting

**Error de conexión a base de datos**
- Verificar que db-grades esté corriendo
- Revisar credenciales en .env
- Esperar el health check de MySQL (~30s)

**Error de validación de JWT**
- Verificar que JWT_SECRET sea el mismo en todos los microservicios
- Verificar que el secret tenga al menos 32 bytes

**Nota fuera de rango**
- Las notas deben estar entre 1.0 y 7.0
- Usar formato decimal con un dígito (ej: 6.5)

## Versión
v0.0.1-SNAPSHOT
