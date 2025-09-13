export const EstadoPedido = Object.freeze({
  PENDIENTE:{    valor: "pendiente",
    crearNotificacion: (pedido) => {
      const mensaje = `Se ha creado un nuevo pedido y está pendiente de confirmación, con ID ${pedido.id}, realizado por el cliente ${pedido.comprador}, incluyendo ${pedido.items} por un total de ${pedido.total} en 
      ${pedido.moneda}, a enviar a la direccion ${pedido.direccionEntrega}. El pedido tiene los siguientes productos: `;
      pedido.items.array.forEach((item) => {
          mensaje += item.producto.titulo += ", ";
        });  
      return new Notificacion(pedido.vendedor, mensaje, new Date());
    },
  },
  
  ACEPTADO: {
    valor: "aceptado",
    crearNotificacion: (Pedido) => {
    },
    }
  ,

  RECHAZADO: {    
     valor: "rechazado",
     crearNotificacion: (Pedido) => {
    },
    },

  ENVIADO: {     
    valor: "enviado",
    crearNotificacion: (pedido) => {
        return new Notificacion(pedido.comprador,crearMensajeSegunEstado(valor), new Date());
    }
  },
  CANCELADO: {     
    valor: "cancelado",
    crearNotificacion: (pedido) => {
        return new Notificacion(pedido.vendedor,crearMensajeSegunEstado(valor),new Date());
    },
  },
  
  FINALIZADO: {     
    valor: "finalizado",
    crearNotificacion: (Pedido) => {
    },
  },
});

function crearMensajeSegunEstado(estado)
{return `El pedido esta en estado: ${estado}`}


export default findEstado = (estado) => _.findBy(EstadoPedido, (value) => value.valor == estado)