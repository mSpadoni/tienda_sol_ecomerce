# 📦 API

Esta API permite crear, consultar y actualizar pedidos dentro del sistema de e-commerce.  
Incluye la generación automática de notificaciones según el estado del pedido.

---

## 🟢 **POST** `/pedidos`  
Crea un nuevo pedido.

### 🧾 **Request Body**
```json
{
  "usuario": 101,
  "moneda": "Peso Argentino",
  "direccionEntrega": {
    "calle": "Av. Corrientes",
    "altura": "1234",
    "piso": "7",
    "departamento": "B",
    "codigoPostal": "1043",
    "ciudad": "Buenos Aires",
    "provincia": "Buenos Aires",
    "pais": "Argentina",
    "lat": "-34.6037",
    "long": "-58.3816"
  },
  "items": [
    { "productoId": 501, "cantidad": 2 },
    { "productoId": 502, "cantidad": 1 }
  ]
}
```

### 🧩 **Descripción de los campos del Request Body**

| Campo | Tipo | Descripción |
|--------|------|-------------|
| `usuario` | number | ID del usuario comprador que realiza el pedido (debe ser de tipo COMPRADOR). |
| `moneda` | string | Moneda utilizada en el pedido. Valores posibles: `Peso Argentino`, `Dólar`, `Real`. |
| `direccionEntrega.calle` | string | Nombre de la calle donde se entregará el pedido. |
| `direccionEntrega.altura` | string | Altura o número de la calle. |
| `direccionEntrega.piso` | string | Piso del domicilio de entrega (opcional). |
| `direccionEntrega.departamento` | string | Departamento o unidad (opcional). |
| `direccionEntrega.codigoPostal` | string | Código postal del domicilio. |
| `direccionEntrega.ciudad` | string | Ciudad de entrega. |
| `direccionEntrega.provincia` | string | Provincia o estado. |
| `direccionEntrega.pais` | string | País de entrega. |
| `direccionEntrega.lat` | string | Latitud geográfica. |
| `direccionEntrega.long` | string | Longitud geográfica. |
| `items[].productoId` | number | ID del producto solicitado. |
| `items[].cantidad` | number | Cantidad del producto pedida. |

### ✅ **Response Body (201 Created)**
```json
{
  "pedido": {
    "id": 1001,
    "comprador": {
      "id": 101,
      "nombre": "Juan Pérez",
      "email": "juanperez@mail.com",
      "telefono": "+54 11 5555-5555",
      "tipo": "COMPRADOR",
      "fechaAlta": "2024-05-20T10:30:00Z"
    },
    "items": [
      {
        "producto": {
          "id": 501,
          "titulo": "Zapatillas deportivas",
          "descripcion": "Zapatillas running Nike Air",
          "precio": 80000,
          "moneda": "PESO_ARG",
          "stock": 25
        },
        "cantidad": 2,
        "precioUnitario": 80000
      }
    ],
    "moneda": "PESO_ARG",
    "direccionEntrega": {
      "calle": "Av. Corrientes",
      "altura": "1234",
      "ciudad": "Buenos Aires",
      "pais": "Argentina"
    },
    "estado": "pendiente",
    "fechaCreacion": "2025-10-10T15:00:00Z"
  },
  "notificacion": {
    "id": "123456789012",
    "usuario": {
      "id": 202,
      "nombre": "Carlos López",
      "tipo": "VENDEDOR"
    },
    "mensaje": "El usuario Juan Pérez ha hecho un pedido...",
    "fechaAlta": "2025-10-10T15:00:01Z",
    "leida": false
  }
}
```

### 🧩 **Descripción de los campos del Response Body**

| Campo | Tipo | Descripción |
|--------|------|-------------|
| `pedido.id` | number | Identificador único del pedido. |
| `pedido.comprador` | object | Usuario que realizó el pedido. |
| `pedido.items` | array | Lista de productos pedidos. |
| `pedido.items[].producto` | object | Detalle del producto. |
| `pedido.items[].cantidad` | number | Cantidad solicitada. |
| `pedido.items[].precioUnitario` | number | Precio unitario del producto. |
| `pedido.moneda` | string | Moneda del pedido. |
| `pedido.direccionEntrega` | object | Información del destino del pedido. |
| `pedido.estado` | string | Estado actual del pedido (`pendiente`, `enviado`, etc.). |
| `pedido.fechaCreacion` | string | Fecha de creación del pedido. |
| `notificacion` | object | Notificación generada al crear el pedido. |
| `notificacion.mensaje` | string | Texto descriptivo de la notificación. |
| `notificacion.fechaAlta` | string | Fecha de creación de la notificación. |

---

## 🔵 **GET** `/usuarios/:id/pedidos`  
Obtiene todos los pedidos realizados por un usuario.

### 🧾 **Request Example**
```
GET /usuarios/101/pedidos
```

### ✅ **Response Body (200 OK)**
```json
[
  {
    "id": 1001,
    "estado": "pendiente",
    "fechaCreacion": "2025-10-10T15:00:00Z",
    "moneda": "PESO_ARG",
    "direccionEntrega": {
      "calle": "Av. Corrientes",
      "altura": "1234",
      "ciudad": "Buenos Aires",
      "pais": "Argentina"
    },
    "items": [
      { "productoId": 501, "cantidad": 2 },
      { "productoId": 502, "cantidad": 1 }
    ]
  }
]
```

### 🧩 **Descripción de los campos del Response Body**

| Campo | Tipo | Descripción |
|--------|------|-------------|
| `[].id` | number | Identificador único del pedido. |
| `[].estado` | string | Estado actual del pedido. |
| `[].fechaCreacion` | string | Fecha de creación. |
| `[].moneda` | string | Moneda del pedido. |
| `[].direccionEntrega` | object | Dirección asociada al pedido. |
| `[].direccionEntrega.calle` | string | Calle del destino. |
| `[].direccionEntrega.altura` | string | Altura de la calle. |
| `[].direccionEntrega.ciudad` | string | Ciudad de entrega. |
| `[].direccionEntrega.pais` | string | País del destino. |
| `[].items` | array | Productos solicitados en el pedido. |
| `[].items[].productoId` | number | ID del producto. |
| `[].items[].cantidad` | number | Cantidad del producto. |

---

## 🟠 **PATCH** `/pedidos/:id`  
Actualiza el estado de un pedido existente.

### 🧾 **Request Body**
```json
{
  "estado": "enviado",
  "usuario": 202,
  "motivo": "Pedido preparado y enviado al comprador."
}
```

### 🧩 **Descripción de los campos del Request Body**

| Campo | Tipo | Descripción |
|--------|------|-------------|
| `estado` | string | Nuevo estado del pedido. Valores posibles: `aceptado`, `rechazado`, `enviado`, `cancelado`, `finalizado`. |
| `usuario` | number | ID del usuario que realiza la acción (comprador o vendedor). |
| `motivo` | string | Motivo o comentario del cambio de estado. |

### ✅ **Response Body (200 OK)**
```json
{
  "pedido": {
    "id": 1001,
    "estado": "enviado",
    "fechaCreacion": "2025-10-10T15:00:00Z",
    "historialEstado": [
      {
        "fecha": "2025-10-10T16:00:00Z",
        "nuevoEstado": "enviado",
        "usuario": {
          "id": 202,
          "nombre": "Carlos López",
          "tipo": "VENDEDOR"
        },
        "motivo": "Pedido preparado y enviado al comprador."
      }
    ]
  },
  "notificacion": {
    "id": "998877665544",
    "usuario": {
      "id": 101,
      "nombre": "Juan Pérez",
      "tipo": "COMPRADOR"
    },
    "mensaje": "Tu pedido ha sido enviado.",
    "fechaAlta": "2025-10-10T16:00:01Z",
    "leida": false
  }
}
```

### 🧩 **Descripción de los campos del Response Body**

| Campo | Tipo | Descripción |
|--------|------|-------------|
| `pedido.id` | number | Identificador único del pedido actualizado. |
| `pedido.estado` | string | Estado actual del pedido. |
| `pedido.fechaCreacion` | string | Fecha original de creación. |
| `pedido.historialEstado` | array | Registros de cambios de estado del pedido. |
| `pedido.historialEstado[].fecha` | string | Fecha del cambio de estado. |
| `pedido.historialEstado[].nuevoEstado` | string | Nuevo estado asignado. |
| `pedido.historialEstado[].usuario` | object | Usuario que realizó el cambio. |
| `pedido.historialEstado[].motivo` | string | Motivo o descripción del cambio. |
| `notificacion.id` | string | ID de la notificación generada. |
| `notificacion.usuario` | object | Usuario al que se le envía la notificación. |
| `notificacion.mensaje` | string | Texto de la notificación. |
| `notificacion.fechaAlta` | string | Fecha de creación de la notificación. |
| `notificacion.leida` | boolean | Indica si la notificación fue leída. |

---
© 2025 - Documentación técnica de la API de Pedidos
