# Configuración Inicial: Keycloak y MongoDB

Este documento describe cómo configurar Keycloak y MongoDB con los datos iniciales necesarios para el proyecto.

## Requisitos Previos

- Docker y Docker Compose instalados
- Bash (para ejecutar los scripts)
- Node.js v18+ (si ejecutas los scripts de MongoDB localmente)

## Proceso de Configuración

### 1. Iniciar Docker Compose

```bash
docker-compose up -d
```

Esto iniciará:
- Keycloak en `http://localhost:8080`
- MongoDB en `mongodb://localhost:27017`
- PostgreSQL (base de datos de Keycloak)

### 2. Configurar Keycloak

Una vez que todos los servicios estén en ejecución, configura Keycloak ejecutando el script:

```bash
# En Windows (PowerShell)
bash ./setup-keycloak.sh

# O desde WSL
./setup-keycloak.sh
```

Este script automáticamente:
- ✓ Espera a que Keycloak esté disponible
- ✓ Se autentica como administrador
- ✓ Crea el realm **ecommerce**
- ✓ Crea dos clientes:
  - **backend_cliente**: Con secreto `wWQA7vgOp4CujCmxJ3UdU9iLDE1NGwV7`
  - **tp_desarrollo**: Cliente público para frontend
- ✓ Crea dos roles:
  - **vendedor**: ID `d06e5f34-2638-4bf9-a096-a9b5fdfcba35`
  - **comprador**: ID `b1a584a6-fc0f-4da9-a3a4-9bb92060af92`
- ✓ Crea un usuario vendedor con:
  - Username: `vendedor`
  - Email: `vendedor@tienda.com`
  - Password: `Vendedor123!`

**⚠️ IMPORTANTE**: El script mostrará el **ID de Keycloak del usuario vendedor** al final. Copia este ID, lo necesitarás para el siguiente paso.

### 3. Configurar MongoDB

Una vez que tengas el ID del usuario de Keycloak del usuario vendedor, ejecuta el script de MongoDB:

```bash
# Reemplaza <KEYCLOAK_USER_ID> con el ID obtenido en el paso anterior
node packages/backend/setup-mongodb.js <KEYCLOAK_USER_ID>

# Ejemplo:
node packages/backend/setup-mongodb.js f47ac10b-58cc-4372-a567-0e02b2c3d479
```

Este script automáticamente:
- ✓ Se conecta a MongoDB
- ✓ Crea un usuario vendedor con el ID de Keycloak proporcionado
- ✓ Crea 27 productos a partir de las imágenes disponibles en `packages/frontend/public/images`
- ✓ Configura cada producto con:
  - Información descriptiva
  - Categoría
  - Precio en pesos argentinos (ARS)
  - Stock disponible
  - Referencia a la imagen
  - Asociación al vendedor creado

## Datos Iniciales Creados

### Usuarios
- **Vendedor**
  - Username: `vendedor`
  - Email: `vendedor@tienda.com`
  - Password: `Vendedor123!`
  - Rol: vendedor

### Clientes OAuth2 / OIDC

#### backend_cliente
- ClientID: `backend_cliente`
- Secret: `wWQA7vgOp4CujCmxJ3UdU9iLDE1NGwV7`
- Tipo: Confidencial
- Web Origins: `http://localhost:3001`
- Propósito: Backend de la aplicación

#### tp_desarrollo
- ClientID: `tp_desarrollo`
- Tipo: Público
- Redirect URIs: `http://localhost:3000/*`
- Web Origins: `http://localhost:3000`
- Propósito: Frontend de la aplicación

### Roles
- **vendedor** (ID: `d06e5f34-2638-4bf9-a096-a9b5fdfcba35`)
- **comprador** (ID: `b1a584a6-fc0f-4da9-a3a4-9bb92060af92`)

### Productos
Se crearán 27 productos automáticamente a partir de las imágenes disponibles:
- Monitores
- Computadoras
- Ropa
- Audio
- Periféricos
- Tecnología Wearable
- Deportes
- Calzado
- Cámaras
- Videojuegos
- Cables

## Solución de Problemas

### El script de Keycloak no se ejecuta
- Asegúrate de estar en una terminal Bash (no PowerShell)
- Si estás en Windows, usa WSL o Git Bash

### Keycloak no responde
- Verifica que los contenedores estén en ejecución: `docker-compose ps`
- Espera 30-60 segundos más después de iniciar Docker Compose
- Revisa los logs: `docker-compose logs keycloak`

### No puedo obtener el ID del usuario en el script de Keycloak
- El script lo imprimirá al final, búscalo en la salida
- Alternativamente, ve al Admin Console de Keycloak y obtén el ID manualmente
- El usuario se lista en: `http://localhost:8080` → Admin Console → ecommerce → Users

### MongoDB no se conecta
- Verifica que MongoDB esté disponible: `docker-compose ps`
- Prueba la conexión: `mongo mongodb://localhost:27017/tienda_sol`
- Revisa los logs: `docker-compose logs mongo`

### Productos duplicados
- El script verifica si un producto ya existe antes de crearlo
- Si ejecutas el script dos veces, no se duplicarán los productos

## Verificación Manual

### Keycloak
1. Ve a `http://localhost:8080`
2. Admin Console: username=`admin`, password=`admin`
3. Realm: `ecommerce`
4. Usuarios: `vendedor`

### MongoDB
```bash
# Conectarse a MongoDB
mongo mongodb://localhost:27017/tienda_sol

# Ver usuarios
db.usuarios.find().pretty()

# Ver productos
db.productos.find().pretty()

# Contar productos
db.productos.count()
```

## Notas Importantes

- ⚠️ El ID del usuario de Keycloak es esencial para relacionar los productos en MongoDB
- ⚠️ Los scripts son idempotentes: pueden ejecutarse múltiples veces sin causar duplicados
- ⚠️ Si necesitas resetear la configuración, elimina los volúmenes de Docker: `docker-compose down -v`

---

**Última actualización**: 2024
