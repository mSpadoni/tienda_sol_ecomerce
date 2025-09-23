export default class FactoryNotificacion {
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
    return pedido.estado.crearNotificacion(pedido);
  }
}
