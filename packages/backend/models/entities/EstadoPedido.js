import Notificacion from "./Notificacion.js"; /*
import { obtenerSimbolo } from "./Moneda.js";*/

export const EstadoPedido = Object.freeze({
  PENDIENTE: {
    valor: "pendiente",
    crearNotificacion: (pedido) => {
      const productos = pedido.items.reduce(
        (mensaje, item) => mensaje + item.producto.titulo,
        "",
      );
      const mensaje =
        `El usuario ${pedido.comprador.nombre} a hecho un pedido por los siguientes productos: ` +
        productos +
        ` a un total de ${pedido.moneda.simbolo}${pedido.calcularTotal()} en ${pedido.direccionEntrega.calle} en piso ${pedido.direccionEntrega.piso} departamento ${pedido.direccionEntrega.departamento} en ${pedido.direccionEntrega.ciudad}, ${pedido.direccionEntrega.provincia}, ${pedido.direccionEntrega.pais}`;
      return new Notificacion(pedido.obtenerVendedor(), mensaje, new Date());
    },
  },

  ACEPTADO: {
    valor: "aceptado",
    crearNotificacion: (Pedido) => {
      return null;
    },
  },
  RECHAZADO: {
    valor: "rechazado",
    crearNotificacion: (Pedido) => {
      return null;
    },
  },

  ENVIADO: {
    valor: "enviado",
    crearNotificacion: (pedido) => {
      return new Notificacion(
        pedido.comprador,
        crearMensajeSegunEstado(EstadoPedido.ENVIADO.valor),
        new Date(),
      );
    },
  },
  CANCELADO: {
    valor: "cancelado",
    crearNotificacion: (pedido) => {
      return new Notificacion(
        pedido.obtenerVendedor(),
        crearMensajeSegunEstado(EstadoPedido.CANCELADO.valor),
        new Date(),
      );
    },
  },

  FINALIZADO: {
    valor: "finalizado",
    crearNotificacion: (Pedido) => {
      return null;
    },
  },
});

export 
function crearMensajeSegunEstado(estado) {
  return `El pedido esta en estado: ${estado}`;
}

const findEstado = (estado) =>
  Object.values(EstadoPedido).find((value) => value.valor === estado);

export default findEstado;
