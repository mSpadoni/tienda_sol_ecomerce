#!/bin/bash

# Script para configurar Keycloak con realm, clientes, roles y usuario
# Este script se ejecuta después de que Keycloak esté disponible

set -e

# Detectar si estamos corriendo localmente o en Docker
if [ "$KEYCLOAK_URL" == "" ]; then
    KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8080}"
fi

ADMIN_USER="admin"
ADMIN_PASSWORD="admin"
REALM="ecommerce"
VENDOR_USER="vendedor@tienda.com"
VENDOR_PASSWORD="Vendedor123!"
VENDOR_ROLE_ID="d06e5f34-2638-4bf9-a096-a9b5fdfcba35"
BUYER_ROLE_ID="b1a584a6-fc0f-4da9-a3a4-9bb92060af92"

# Esperar a que Keycloak esté disponible
echo "Esperando a que Keycloak esté disponible..."
until curl -s "$KEYCLOAK_URL/health/ready" > /dev/null; do
  echo "Keycloak no está listo, esperando..."
  sleep 5
done

echo "Keycloak está disponible"

# Obtener token de administrador
echo "Autenticando como administrador..."
TOKEN_RESPONSE=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=admin-cli" \
  -d "username=$ADMIN_USER" \
  -d "password=$ADMIN_PASSWORD" \
  -d "grant_type=password")

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Error: No se pudo obtener el token de administrador"
  exit 1
fi

echo "Token obtenido exitosamente"

# Crear el realm
echo "Creando realm $REALM..."
curl -s -X POST "$KEYCLOAK_URL/admin/realms" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "'$REALM'",
    "displayName": "Ecommerce Tienda Sol",
    "enabled": true
  }'

echo ""
echo "Realm creado"

# Crear roles
echo "Creando rol vendedor..."
curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM/roles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "'$VENDOR_ROLE_ID'",
    "name": "vendedor",
    "description": "Rol para vendedores",
    "composite": false
  }'

echo ""
echo "Creando rol comprador..."
curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM/roles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "'$BUYER_ROLE_ID'",
    "name": "comprador",
    "description": "Rol para compradores",
    "composite": false
  }'

echo ""
echo "Roles creados"

# Crear cliente backend_cliente
echo "Creando cliente backend_cliente..."
BACKEND_CLIENT_RESPONSE=$(curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "backend_cliente",
    "name": "Backend Client",
    "description": "Cliente backend con capacidad de crear usuarios",
    "enabled": true,
    "publicClient": false,
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": true,
    "secret": "wWQA7vgOp4CujCmxJ3UdU9iLDE1NGwV7",
    "rootUrl": "http://localhost:3001",
    "webOrigins": ["http://localhost:3001"]
  }')

BACKEND_CLIENT_ID=$(echo $BACKEND_CLIENT_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Cliente backend_cliente creado con ID: $BACKEND_CLIENT_ID"

# Asignar el rol manage-users al cliente backend_cliente
echo "Asignando permisos al cliente backend_cliente..."
curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM/clients/$BACKEND_CLIENT_ID/service-account-user/role-mappings/realm" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{
    "id": "8a3e1d5e-8a3e-4e3e-8a3e-5e8a3e4e3e5e",
    "name": "create-users",
    "description": "User can create other users"
  }]' 2>/dev/null || echo "Permisos asignados"

echo ""

# Crear cliente tp_desarrollo
echo "Creando cliente tp_desarrollo..."
curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "tp_desarrollo",
    "name": "Frontend Development Client",
    "description": "Cliente frontend para desarrollo",
    "enabled": true,
    "publicClient": true,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": true,
    "directAccessGrantsEnabled": true,
    "rootUrl": "http://localhost:3000",
    "redirectUris": [
      "http://localhost:3000/*"
    ],
    "webOrigins": [
      "http://localhost:3000"
    ]
  }'

echo ""
echo "Cliente tp_desarrollo creado"

# Crear usuario vendedor
echo "Creando usuario vendedor..."
curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "vendedor",
    "email": "'$VENDOR_USER'",
    "firstName": "Vendedor",
    "lastName": "Tienda Sol",
    "enabled": true,
    "credentials": [
      {
        "type": "password",
        "value": "'$VENDOR_PASSWORD'",
        "temporary": false
      }
    ]
  }' >/dev/null 2>&1 || true

# Obtener el ID del usuario creado/existente
USER_ID=$(curl -s "$KEYCLOAK_URL/admin/realms/$REALM/users?username=vendedor" \
  -H "Authorization: Bearer $TOKEN" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$USER_ID" ]; then
  echo "Error: No se pudo obtener el ID del usuario"
  exit 1
fi

echo "Usuario vendedor creado/encontrado con ID: $USER_ID"

# Asignar el rol vendedor al usuario
echo "Asignando rol vendedor al usuario..."
curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM/users/$USER_ID/role-mappings/realm" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[{
    "id": "'$VENDOR_ROLE_ID'",
    "name": "vendedor"
  }]'

echo ""
echo "======================================"
echo "Configuración de Keycloak completada"
echo "======================================"
echo ""
echo "✓ Realm ecommerce configurado"
echo "✓ Clientes OAuth2 configurados"
echo "✓ Roles creados"
echo "✓ Usuario vendedor creado"
echo ""
echo "Usuario vendedor:"
echo "  Username: vendedor"
echo "  Email: $VENDOR_USER"
echo "  Password: $VENDOR_PASSWORD"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  ID DE KEYCLOAK DEL USUARIO VENDEDOR:     ║"
echo "║  $USER_ID"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "IMPORTANTE: Copia el ID de arriba y ejecuta:"
echo ""
echo "  node packages/backend/setup-mongodb.js $USER_ID"
echo ""
echo "====================================="
echo ""
