import { Notificacion } from "./Notificacion.js";
import { Pedido } from "./Pedido.js";
import { EstadoPedido } from "./EstadoPedido.js";

export class FactoryNotificacion {
  constructor() {
    if (FactoryNotificacion.instance) {
      return FactoryNotificacion.instance;
    }
    FactoryNotificacion.instance = this;
  }

  getInstance() {
    if (!FactoryNotificacion.instance) {
      FactoryNotificacion.instance = new FactoryNotificacion();
    }
    return FactoryNotificacion.instance;
  }

  crearSegunEstadoPedido(estado) {
    switch (estado) {
      case EstadoPedido.PENDIENTE:
        return "Se ha creado un nuevo pedido y está pendiente de confirmación, ";
      case EstadoPedido.ENVIADO:
        return "El pedido ha sido enviado.. ";
      case EstadoPedido.CANCELADO:
        return "El pedido ha sido cancelado";
      default:
        return `El pedido ha pasado a estado ${estado}`;
    }
  }

  crearSegunPedido(pedido) {
    let mensaje = crearSegunEstadoPedido(pedido.estado);
    switch (pedido.estado) {
      case EstadoPedido.PENDIENTE:
        mensaje += ` con ID ${pedido.id}, realizado por el cliente ${pedido.comprador}, incluyendo ${pedido.items} por un total de ${pedido.total} en ${pedido.moneda}, a enviar a la direccion ${pedido.direccionEntrega}. El pedido tiene los siguientes productos: `;
        pedido.items.array.forEach((item) => {
          mensaje += item.producto.titulo += ", ";
        });
        return new Notificacion(pedido.vendedor, mensaje, new Date());
      case EstadoPedido.ENVIADO:
        return new Notificacion(pedido.usuario, mensaje, new Date());
      case EstadoPedido.CANCELADO:
        return new Notificacion(pedido.vendedor, mensaje, new Date());
      default:
        return null;
    }
  }
}
