import { Notificacion } from "./Notificacion.js";
import { EstadoPedido } from "./EstadoPedido.js";

export class FactoryNotificacion {
  constructor() {}
/*
  crearSegunEstadoPedido(estado) {
    return `El pedido ha pasado a estado ${estado}`;
  }
*/

  crearSegunEstadoPedido(estado) {
    switch(estado){
      case EstadoPedido.PENDIENTE:
        return "Se ha creado un nuevo pedido y está pendiente de confirmación";
      case EstadoPedido.ENVIADO:
        return "El pedido ha sido enviado";
      case EstadoPedido.CANCELADO:
        return "El pedido ha sido cancelado";
      default:
        return `El pedido ha pasado a estado ${estado}`;
    }
  }

  crearSegunPedido(pedido) {
    let mensaje=this.crearSegunEstadoPedido(pedido.estado)
    return new Notificacion( pedido.usuario, mensaje, new Date() );
  }
  
}

/*export class FactoryNotificacion {
  crearPedidoRealizado(pedido) {
    const mensaje = `Nuevo pedido de ${pedido.usuario.nombre}:
    Productos: ${pedido.items.map(i => i.producto.nombre).join(", ")}
    Total: ${pedido.total} ${pedido.moneda}
    Dirección: ${pedido.direccionEntrega.calle}, ${pedido.direccionEntrega.numero}`;
    
    return new Notificacion(pedido.vendedor, mensaje, new Date());
  }

  crearPedidoEnviado(pedido) {
    const mensaje = `Tu pedido ${pedido.id} ha sido enviado. 
    Productos: ${pedido.items.map(i => i.producto.nombre).join(", ")}
    Total: ${pedido.total} ${pedido.moneda}`;
    
    return new Notificacion(pedido.usuario, mensaje, new Date());
  }

  crearPedidoCancelado(pedido) {
    const mensaje = `El pedido ${pedido.id} ha sido cancelado por ${pedido.usuario.nombre}.
    Productos: ${pedido.items.map(i => i.producto.nombre).join(", ")}
    Total: ${pedido.total} ${pedido.moneda}`;
    
    return new Notificacion(pedido.vendedor, mensaje, new Date());
  }

  PEDIDO
  marcarEnviado() {
  this.estado = EstadoPedido.ENVIADO;
  const notificacion = new FactoryNotificacion().crearPedidoEnviado(this);
  this.usuario.notificaciones.push(notificacion);
}

cancelarPedido() {
  this.estado = EstadoPedido.CANCELADO;
  const notificacion = new FactoryNotificacion().crearPedidoCancelado(this);
  this.vendedor.notificaciones.push(notificacion);
}
} */