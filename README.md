# Tienda Sol: e-commerce full stack

Tienda online con compradores y vendedores: carrito, pedidos con estados, notificaciones y login por roles. Proyecto académico (UTN-FRBA, 2025), en un equipo de 5.

### [🛒 Probar la tienda en vivo](https://tienda-sol-ecommerce.vercel.app)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Keycloak](https://img.shields.io/badge/Keycloak-2C3E50?style=flat-square&logo=keycloak&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

![Inicio de la tienda](docs/img/inicio.jpg)

## Probala

- **Comprador:** tocá **Iniciar sesión → Creá tu cuenta** y hacé un pedido.
- **Vendedor:** entrá con **`vendedor`** / **`Demo-f2PEDewa`** y abrí **Pedidos Recibidos**.

> Si el login tarda en aparecer, esperá un minuto: el servidor gratuito se está despertando.

## Qué tiene

- **API REST en capas** con Node.js, Express y MongoDB, validada con Zod.
- **Login y roles** (comprador / vendedor) con Keycloak y JWT, controlados en el menú, en las rutas y en la API.
- **Pedidos con reglas de negocio:** solo el comprador cancela, solo el vendedor envía.
- **Tests** unitarios y de integración con Jest y Supertest.
- **Desplegado en la nube:** Vercel, Render, Neon y MongoDB Atlas.

<details>
<summary><b>Correrlo en tu máquina</b></summary>

Necesitás **Docker** y **Node.js 20+**.

```bash
cp packages/backend/.env.example packages/backend/.env
docker compose up -d --build
npm install
npm run start:frontend
```

Abrí `http://localhost:3000`. En local, el vendedor es **`vendedor`** / **`Vendedor123!`**. Tests: `npm test`.
</details>
