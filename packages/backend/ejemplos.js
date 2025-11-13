import Pedido from "./models/entities/Pedido.js";
import Usuario from "./models/entities/Usuario.js";
import DireccionEntrega from "./models/entities/DireccionEntrega.js";
import ItemProducto from "./models/entities/ItemPedido.js";
import Producto from "./models/entities/Producto.js";
import Notificacion from "./models/entities/Notificacion.js";
import {
  EstadoPedido,
  crearMensajeSegunEstado,
} from "./models/entities/EstadoPedido.js";
import { TipoUsuario } from "./models/entities/TipoUsuario.js";

//usuarios de ejemplo
export const usuario1 = new Usuario(
  null,
  "Juan Perez",
  "juanperez@gmail.com",
  " ",
  TipoUsuario.COMPRADOR,
  new Date(),
);

export const usuario2 = new Usuario(
  null,
  "Ana Gomez",
  "anaGomez@frba.utn.edu,ar",
  " ",
  TipoUsuario.COMPRADOR,
  new Date(),
);

export const usuario3 = new Usuario(
  null,
  "Ana Gomez",
  "anaGomez@frba.utn.edu,ar",
  " ",
  TipoUsuario.COMPRADOR,
  new Date(),
);

export const usuario4 = new Usuario(
  null,
  "admin",
  "@gmail.com",
  " ",
  TipoUsuario.VENDEDOR,
  new Date(),
);

//productos de ejemplo
export const prodEjemplo1 = new Producto(
  usuario4,
  "milanesa",
  "rica milanesa",
  ["comida"],
  5000,
  "Peso Argentino",
  10,
  [],
  true,
);

export const prodEjemplo2 = new Producto(
  usuario4,
  "milanesa",
  "rica milanesa",
  ["comida"],
  5000,
  "Peso Argentino",
  10,
  [],
  true,
);
usuario1.id = 1;
usuario2.id = 2;
usuario3.id = 3;
usuario4.id = 4;
export const item = new ItemProducto(prodEjemplo2, 2, 1000);
export const item2 = new ItemProducto(prodEjemplo2, 4, 1000);

export const direccion = new DireccionEntrega(
  "Calle Falsa",
  "123",
  "1",
  "A",
  "1000",
  "Ciudad",
  "Provincia",
  "-34.6037",
  "-58.3816",
  "",
  "",
);

export const jsonPedidosEjemplo1 = new Pedido(
  usuario1,
  [item],
  "Peso Argentino",
  direccion,
  new Date(),
);

export const jsonPedidosEjemplo2 = new Pedido(
  usuario1,
  [item, item2],
  "Peso Argentino",
  direccion,
  new Date(),
);

export const jsonPedidosEjemplo3 = new Pedido(
  usuario1,
  [item],
  "Peso Argentino",
  direccion,
  new Date(),
);

const mensaje1 =
  "El usuario Juan Perez a hecho un pedido por los siguientes productos: milanesa a un total de undefined2000 en Calle Falsa en piso 1 departamento A en Ciudad, Provincia, -34.6037";
const mensaje2 = crearMensajeSegunEstado(EstadoPedido.CANCELADO.valor);
const mensaje3 = crearMensajeSegunEstado(EstadoPedido.ENVIADO.valor);

//notificaciones de ejemplo
export const noti1 = new Notificacion(usuario4, mensaje1, new Date());
export const noti2 = new Notificacion(usuario4, mensaje2, new Date());
export const noti3 = new Notificacion(usuario1, mensaje3, new Date());
