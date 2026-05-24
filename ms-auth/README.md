ms-auth
=======

Servicio de autenticación para CBO Classroom System.

Resumen
- Spring Boot 3, Java 17
- MySQL para persistencia
- JWT para autenticación

Endpoints principales
- POST /auth/login -> Login
- POST /auth/refresh -> Refresh token (Bearer header)
- POST /auth/users -> Registrar usuario
- GET /auth/users -> Listar usuarios (auth required)
- GET /auth/users/{id} -> Obtener usuario por id
- GET /auth/users/me -> Perfil del usuario autenticado (Bearer header)

Variables de entorno relevantes
- AUTH_DB_NAME, AUTH_DB_USER, AUTH_DB_PASS
- JWT_SECRET, JWT_EXPIRATION_MS

Desarrollo
- Usar `./mvnw clean package` para construir
- Run tests: `./mvnw test`

Notas y recomendaciones
- Mantener JWT_SECRET seguro (no en VCS). Usar secret manager en producción.
- Añadir rate limiting y registro de intentos de login para evitar abuso.
- Habilitar TLS en producción y configurar políticas CORS en gateway.
