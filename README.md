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

## Qué hicimos

Construimos en equipo un marketplace estilo Mercado Libre, de punta a punta. Del lado del backend armamos una **API REST en capas** con Node.js, Express y MongoDB, donde el pedido funciona como una **máquina de estados** con reglas de negocio: solo el comprador cancela, solo el vendedor envía, el stock se descuenta y se devuelve, y cada cambio genera una notificación. La seguridad la resolvimos con **Keycloak y JWT**, con permisos por rol en el menú, las rutas y la API. El frontend en **React** tiene catálogo con filtros, carrito, checkout y seguimiento de pedidos, y se adapta al celular. Tiene **tests en Jest**, se levanta con **Docker** y está **desplegado en la nube**.

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
