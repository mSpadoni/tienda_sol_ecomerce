import Notificacion from "./Notificacion.js";




export const EstadoPedido = Object.freeze({
  PENDIENTE: {
    valor: "pendiente",
    crearNotificacion: (pedido) => {
      var mensaje = `Se ha creado un nuevo pedido y está pendiente de confirmación, con ID ${pedido.id}, realizado por el cliente ${pedido.comprador}, incluyendo ${pedido.items} por un total de ${pedido.total} en 
      ${pedido.moneda}, a enviar a la direccion ${pedido.direccionEntrega}. El pedido tiene los siguientes productos: `;
      pedido.items.reduce((acc,item) => {
        acc + item.producto.titulo + ", ";
      },{mensaje});
      return new Notificacion(pedido.vendedor, mensaje, new Date());
    },
  },

  ACEPTADO: {
    valor: "aceptado",
    crearNotificacion: (Pedido) => {},
  },
  RECHAZADO: {
    valor: "rechazado",
    crearNotificacion: (Pedido) => {},
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
        pedido.vendedor,
        crearMensajeSegunEstado(EstadoPedido.CANCELADO.valor),
        new Date(),
      );
    },
  },

  FINALIZADO: {
    valor: "finalizado",
    crearNotificacion: (Pedido) => {},
  },
});

function crearMensajeSegunEstado(estado) {
  return `El pedido esta en estado: ${estado}`;
}


const findEstado = (estado) =>
  Object.values(EstadoPedido).find((value) => value.valor === estado);

export default findEstado;