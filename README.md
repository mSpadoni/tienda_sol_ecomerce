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

El desafío fue construir, desde cero y en equipo, un marketplace al estilo Mercado Libre: un sistema donde vendedores publican productos y compradores los encuentran, los compran y siguen su pedido hasta que llega. Lo encaramos como un producto real, con backend, frontend, seguridad, tests e infraestructura.

**🧱 Backend: el corazón del negocio**
- Diseñamos el **modelo de dominio** (usuarios, productos, pedidos y notificaciones) y una **API REST** en Node.js y Express, separada en capas: rutas, controladores, servicios y repositorios.
- Modelamos el **ciclo de vida del pedido** como una máquina de estados (confirmado → enviado → finalizado, o cancelado / rechazado), con reglas que la API hace cumplir. Por ejemplo: solo el comprador puede cancelar, solo el vendedor puede enviar y no se cancela algo ya enviado.
- Al confirmar un pedido se **valida y descuenta el stock**, y si se cancela se devuelve. Cada cambio de estado genera una **notificación** para la persona que corresponde.
- Validamos los datos de entrada con **Zod** y manejamos los errores con **14 excepciones de dominio**, cada una con su respuesta HTTP clara. La API está documentada con **Swagger**.

**🔐 Seguridad: quién puede hacer qué**
- Integramos **Keycloak** para el login y los roles, con tokens **JWT** que la API valida en cada pedido.
- Los permisos se controlan en **tres capas**: el menú muestra solo lo que te corresponde, las rutas del frontend lo verifican y la API rechaza lo que no tenés permitido.
- Personalizamos la pantalla de login con el diseño de la tienda.

**🖥️ Frontend: la experiencia de compra**
- Hicimos una app en **React** con Material UI: catálogo con **búsqueda, filtros, orden y paginación**, detalle de producto, carrito y checkout.
- Las vistas **"Mis pedidos"** (comprador) y **"Pedidos recibidos"** (vendedor) permiten seguir y gestionar cada pedido.
- Es **responsive**: en el celular, los formularios largos se completan paso a paso.
- Los precios se pueden ver en **distintas monedas**, con cotizaciones que la API consulta y guarda en caché.

**✅ Calidad e infraestructura**
- Escribimos **tests** unitarios y de integración con **Jest** y **Supertest**.
- Con un solo `docker compose up` se levanta todo el entorno: MongoDB, Keycloak y PostgreSQL, con datos de ejemplo cargados.
- Lo **desplegamos en la nube**: el frontend y la API en Vercel, Keycloak en Docker sobre Render, y las bases en Neon y MongoDB Atlas.

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
