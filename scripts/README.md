# Scripts de Utilidad

Este directorio contiene scripts de PowerShell para facilitar tareas comunes del proyecto.

## 📜 Scripts Disponibles

### generate-jwt-secret.ps1
Genera un JWT Secret seguro de 32 bytes en formato base64.

**Uso:**
```powershell
.\scripts\generate-jwt-secret.ps1
```

**Salida:**
```
JWT_SECRET generado:
cj20oTlGnLiZASF5Eig35A0Kp8W9rQYXdDEkkyqL/AE=

Copia este valor en tu archivo .env:
JWT_SECRET=cj20oTlGnLiZASF5Eig35A0Kp8W9rQYXdDEkkyqL/AE=
```

---

### setup-env.ps1
Configura el entorno inicial del proyecto generando automáticamente:
- JWT Secret seguro
- Password para MySQL Root
- Password para Auth Database
- Actualiza el archivo .env con estos valores

**Uso:**
```powershell
.\scripts\setup-env.ps1
```

**Nota:** Si el archivo `.env` ya existe, pedirá confirmación antes de sobrescribirlo.

---

## 🐧 Para Linux/Mac

Si estás en Linux o Mac, puedes generar secretos con:

```bash
# Generar JWT Secret
openssl rand -base64 32

# Generar passwords
openssl rand -base64 24 | head -c 20
```

---

## 🔒 Seguridad

**IMPORTANTE:** 
- Nunca commitees el archivo `.env` con valores reales
- Guarda las credenciales generadas en un gestor de contraseñas
- Regenera los secretos para cada entorno (dev, staging, prod)
- No reutilices secretos entre ambientes

---

## 📝 Notas

- Los scripts están diseñados para Windows PowerShell
- Requieren permisos de ejecución (pueden necesitar: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)
- Son idempotentes: puedes ejecutarlos múltiples veces de forma segura
