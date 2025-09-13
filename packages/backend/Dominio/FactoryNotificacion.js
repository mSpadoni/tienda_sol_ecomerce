import  Notificacion from "./Notificacion.js";
import  Pedido from "./Pedido.js";
import EstadoPedido from "./EstadoPedido.js";

export  class FactoryNotificacion {
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
  
  crearSegunPedido(pedido) {
    return pedido.estado.crearNotificacion(pedido)
  }
}
