# Script para configurar el entorno inicial
# Uso: .\scripts\setup-env.ps1

Write-Host "=== Configuración Inicial del Proyecto CBO Classroom ===" -ForegroundColor Cyan
Write-Host ""

# Verificar si .env ya existe
if (Test-Path ".env") {
    Write-Host "ADVERTENCIA: El archivo .env ya existe." -ForegroundColor Yellow
    $overwrite = Read-Host "¿Deseas sobrescribirlo? (s/N)"
    if ($overwrite -ne "s" -and $overwrite -ne "S") {
        Write-Host "Operación cancelada." -ForegroundColor Red
        exit 0
    }
}

# Copiar .env.example a .env
Write-Host "Copiando .env.example a .env..." -ForegroundColor Green
Copy-Item ".env.example" ".env"

# Generar JWT Secret
Write-Host ""
Write-Host "Generando JWT Secret seguro..." -ForegroundColor Green
$bytes = New-Object Byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$jwtSecret = [Convert]::ToBase64String($bytes)

# Generar password para MySQL Root
Write-Host "Generando password para MySQL Root..." -ForegroundColor Green
$rootPassBytes = New-Object Byte[] 24
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($rootPassBytes)
$rootPass = [Convert]::ToBase64String($rootPassBytes).Substring(0, 20)

# Generar password para Auth DB
Write-Host "Generando password para Auth DB..." -ForegroundColor Green
$authPassBytes = New-Object Byte[] 24
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($authPassBytes)
$authPass = [Convert]::ToBase64String($authPassBytes).Substring(0, 20)

# Actualizar .env
Write-Host "Actualizando archivo .env con valores seguros..." -ForegroundColor Green
$envContent = Get-Content ".env" -Raw

$envContent = $envContent -replace 'JWT_SECRET=REPLACE_WITH_BASE64_32_BYTES_MINIMUM', "JWT_SECRET=$jwtSecret"
$envContent = $envContent -replace 'MYSQL_ROOT_PASSWORD=REPLACE_WITH_STRONG_PASSWORD', "MYSQL_ROOT_PASSWORD=$rootPass"
$envContent = $envContent -replace 'AUTH_DB_PASS=REPLACE_WITH_STRONG_PASSWORD', "AUTH_DB_PASS=$authPass"

Set-Content ".env" $envContent

Write-Host ""
Write-Host "=== Configuración Completada ===" -ForegroundColor Green
Write-Host ""
Write-Host "Archivo .env creado con valores seguros:" -ForegroundColor Cyan
Write-Host "  - JWT_SECRET: $jwtSecret" -ForegroundColor White
Write-Host "  - MYSQL_ROOT_PASSWORD: $rootPass" -ForegroundColor White
Write-Host "  - AUTH_DB_PASS: $authPass" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE: Guarda estos valores de forma segura antes de continuar." -ForegroundColor Yellow
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Revisar y ajustar el archivo .env si es necesario" -ForegroundColor White
Write-Host "  2. Ejecutar: docker-compose up --build" -ForegroundColor White
Write-Host "  3. Crear un usuario administrador inicial" -ForegroundColor White
Write-Host ""
