# Copilot Instructions for AI Coding Agents

## Arquitectura General

- **Monorepo** con dos paquetes principales bajo `packages/`:
  - `backend/` (Express.js, API REST, lógica de negocio)
  - `frontend/` (React, Create React App)
- El backend expone endpoints y gestiona la lógica de pedidos, usuarios, productos y notificaciones. El frontend consume la API y presenta la interfaz de usuario.
- Comunicación entre frontend y backend vía HTTP (CORS habilitado, orígenes configurables en `.env`).

## Flujos de Desarrollo

- Instala dependencias desde la raíz con `npm install` (usa workspaces).
- Levanta el backend: `npm start` desde `packages/backend` (o usa el script definido en su `package.json`).
- Levanta el frontend: `npm start` desde `packages/frontend`.
- Configura variables de entorno en `packages/backend/.env` (ver `.env.example`).

## Convenciones y Patrones

- **Controladores** en `backend/controller/` gestionan la lógica de rutas y delegan a servicios/repositorios.
- **Servicios** en `backend/service/` encapsulan lógica de negocio y notificaciones.
- **Repositorios** en `backend/repository/` manejan acceso a datos (archivos JSON, etc.).
- **Dominio** en `backend/Dominio/` define entidades y lógica de negocio central (ejemplo: `Pedido.js`, `Usuario.js`).
- **Middlewares** en `backend/middlewares/` para autenticación y validaciones de pedidos.
- **Errores personalizados** en `backend/errors/` y `backend/Errores/`.
- **Archivos de datos** en `backend/Archivos/` (ejemplo: `pedidos.JSON`).

## Integraciones y Dependencias

- Backend depende de `express`, `cors`, `dotenv` (ver `backend/package.json`).
- Frontend usa React y scripts estándar de Create React App.
- No hay base de datos relacional; los datos se almacenan en archivos JSON.

## Ejemplo de Flujo de Pedido

1. El frontend envía una solicitud a un endpoint de pedidos.
2. El controlador (`ControllerPedidos.js`) valida y procesa la solicitud.
3. El servicio (`pedidoService.js`) ejecuta la lógica de negocio.
4. El repositorio (`pedidoRepository.js`) persiste/lee datos de `pedidos.JSON`.
5. Se pueden disparar notificaciones vía `notifyServiceAux.js` y el dominio `Notificacion.js`.

## Pruebas y Debug

- Frontend: `npm test` en `packages/frontend` (Jest).
- Backend: No se detectan pruebas automatizadas; agregar en el futuro si es necesario.
- Logs en `logger/app.log` y lógica en `logger/logger.js`.

## Reglas y Consejos Específicos

- Mantén la separación de responsabilidades entre controladores, servicios y repositorios.
- Usa los modelos de dominio para validar y transformar datos.
- Actualiza los orígenes permitidos en `.env` al desplegar en producción.
- Si agregas nuevas entidades, sigue el patrón de `Dominio/` y actualiza los repositorios y servicios correspondientes.

## Archivos Clave

- `packages/backend/controller/ControllerPedidos.js`: Ejemplo de controlador principal.
- `packages/backend/service/pedidoService.js`: Lógica de negocio de pedidos.
- `packages/backend/repository/pedidoRepository.js`: Persistencia de pedidos.
- `packages/backend/Dominio/Pedido.js`: Modelo de dominio de pedido.
- `packages/backend/Archivos/pedidos.JSON`: Almacenamiento de datos.
- `packages/frontend/src/App.js`: Entrada principal del frontend.

---

Actualiza estas instrucciones si cambian los flujos, dependencias o convenciones. Consulta los README para detalles adicionales.
