import Pedido from "./Dominio/Pedido.js";
import Usuario from "./Dominio/Usuario.js";
import DireccionEntrega from "./Dominio/DireccionEntrega.js";
import ItemProducto from "./Dominio/ItemPedido.js";
import Producto from "./Dominio/Producto.js";
import Notificacion from "./Dominio/Notificacion.js";
import { EstadoPedido,crearMensajeSegunEstado } from "./Dominio/EstadoPedido.js";
import { TipoUsuario } from "./Dominio/TipoUsuario.js";

//usuarios de ejemplo
export
 const usuario1=new Usuario(
    1,
    "Juan Perez",
    "juanperez@gmail.com",
    " ",
    TipoUsuario.COMPRADOR,
    new Date(),
  )

  export
  const usuario2=new Usuario(
    2,
    "Ana Gomez",
    "anaGomez@frba.utn.edu,ar",
    " ",
    TipoUsuario.COMPRADOR,
    new Date(),
  )

  export
  const usuario3=new Usuario(
    3,
    "Ana Gomez",
    "anaGomez@frba.utn.edu,ar",
    " ",
    TipoUsuario.COMPRADOR,
    new Date(),
  )

  export
  const usuario4=new Usuario(4, "admin", "@gmail.com", " ", TipoUsuario.VENDEDOR, new Date())


//productos de ejemplo
  export
  const prodEjemplo1 = new Producto(
  1,
  new Usuario(3, "admin", "@gmail.com", " ", "Admin", new Date()),
  "milanesa",
  "rica milanesa",
  ["comida"],
  5000,
  "Peso Argentino",
  10,
  [],
  true,
);

export
const prodEjemplo2 = new Producto(
  2,
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

export
const item = new ItemProducto(prodEjemplo2, 2, 1000);
export
const item2 = new ItemProducto(prodEjemplo2, 4, 1000);

export
const direccion = new DireccionEntrega(
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

export
const jsonPedidosEjemplo1 = new Pedido(
  1,
 usuario1,
  [item
  ],
  "Peso Argentino",
  direccion,
  new Date(),
);

export
const jsonPedidosEjemplo2 = new Pedido(
  2,
  usuario2,
  [item,
    item2
  ],
  "Peso Argentino",
  direccion,
  new Date(),
);

export
const jsonPedidosEjemplo3 = new Pedido(
  1,
  usuario3,
  [item],
  "Peso Argentino",
  direccion,
  new Date(),
);

const mensaje1="El usuario Juan Perez a hecho un pedido por los siguientes productos: milanesa a un total de undefined2000 en Calle Falsa en piso 1 departamento A en Ciudad, Provincia, -34.6037"
const mensaje2=crearMensajeSegunEstado(EstadoPedido.CANCELADO.valor)
const mensaje3=crearMensajeSegunEstado(EstadoPedido.ENVIADO.valor)

//notificaciones de ejemplo
export
const noti1= new Notificacion(usuario4,mensaje1,new Date())
export
const noti2=new Notificacion(usuario4,mensaje2,new Date())
export
const noti3=new Notificacion(usuario1,mensaje3,new Date())


