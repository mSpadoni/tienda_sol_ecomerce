# Script de configuración inicial para Keycloak y MongoDB
# Uso: .\setup-initial-data.ps1

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Configuración Inicial: Keycloak y MongoDB" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker Compose está corriendo
Write-Host "Verificando Docker Compose..." -ForegroundColor Yellow
$dockerStatus = docker-compose ps -q keycloak
if (-not $dockerStatus) {
    Write-Host "ERROR: Docker Compose no está disponible" -ForegroundColor Red
    Write-Host "Ejecuta: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Docker Compose está disponible" -ForegroundColor Green
Write-Host ""

# Ejecutar setup de Keycloak
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Paso 1: Configurando Keycloak..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Si tienes Git Bash o WSL disponible, ejecuta el script bash
if (Get-Command bash -ErrorAction SilentlyContinue) {
    bash ./setup-keycloak.sh
    $lastExitCode = $LASTEXITCODE
} else {
    Write-Host "ERROR: Bash no está disponible" -ForegroundColor Red
    Write-Host "Por favor instala Git Bash o usa WSL" -ForegroundColor Yellow
    Write-Host "O ejecuta manualmente: bash ./setup-keycloak.sh" -ForegroundColor Yellow
    exit 1
}

if ($lastExitCode -ne 0) {
    Write-Host "ERROR: La configuración de Keycloak falló" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host ""

# Solicitar el ID del usuario de Keycloak
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Paso 2: Configurando MongoDB" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$keycloakUserId = Read-Host "Ingresa el ID del usuario de Keycloak del vendedor (fue mostrado arriba)"

if ([string]::IsNullOrWhiteSpace($keycloakUserId)) {
    Write-Host "ERROR: ID de usuario de Keycloak no puede estar vacío" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Ejecutando configuración de MongoDB..." -ForegroundColor Yellow

# Ejecutar setup de MongoDB
node packages/backend/setup-mongodb.js $keycloakUserId

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: La configuración de MongoDB falló" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✓ Configuración completada exitosamente!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "La aplicación está lista para usarse:" -ForegroundColor Green
Write-Host "  • Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  • Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "  • Keycloak: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Usuario de prueba:" -ForegroundColor Green
Write-Host "  • Username: vendedor" -ForegroundColor Cyan
Write-Host "  • Password: Vendedor123!" -ForegroundColor Cyan
Write-Host ""
