# Script para generar un JWT Secret seguro de 32 bytes en base64
# Uso: .\scripts\generate-jwt-secret.ps1

Write-Host "Generando JWT Secret seguro (32 bytes / 256 bits)..." -ForegroundColor Cyan
Write-Host ""

$bytes = New-Object Byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

Write-Host "JWT_SECRET generado:" -ForegroundColor Green
Write-Host $secret -ForegroundColor Yellow
Write-Host ""
Write-Host "Copia este valor en tu archivo .env:" -ForegroundColor Cyan
Write-Host "JWT_SECRET=$secret" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE: Guarda este secret de forma segura. Si lo pierdes, todos los tokens actuales serán invalidados." -ForegroundColor Red
