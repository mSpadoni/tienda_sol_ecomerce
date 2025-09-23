import logger from "../../logger/logger.js";
import FactoryNotificacion from "../Dominio/FactoryNotificacion.js";

export default class ServiceNotificacionesAux {
  constructor(notificacionesRepository) {
    this.notificacionesRepository = notificacionesRepository;
    this.factoryNotificacion = new FactoryNotificacion().getInstance();
  }

  crearNotificacion(pedido) {
    const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
    logger.info(`${JSON.stringify(notificacion)}`);
    this.notificacionesRepository.save(notificacion);
    logger.info(`Notificacion creada: ${JSON.stringify(notificacion)}`);
    return notificacion;
  }
}
