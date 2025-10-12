import logger from "../../logger/logger.js";
import FactoryNotificacion from "../models/entities/FactoryNotificacion.js";

export default class NotificacionesService {
  constructor(notificacionesRepository) {
    this.notificacionesRepository = notificacionesRepository;
    this.factoryNotificacion = new FactoryNotificacion().getInstance();
  }

  async getNotificaciones(filtros) {
    return await this.notificacionesRepository.getNotificaciones(filtros);
  }

  async marcarNotificacionComoLeida(id) {
    return await this.notificacionesRepository.marcarNotificacionComoLeida(id);
  }

  async getNotificacionById(id) {
    const notificacion = await this.notificacionesRepository.findById(id);
    return notificacion;
  }

  async crearNotificacion(pedido) {
    const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
    logger.info(`${JSON.stringify(notificacion)}`);
    await this.notificacionesRepository.save(notificacion);
    logger.info(`Notificacion creada: ${JSON.stringify(notificacion)}`);
    return notificacion;
  }
}
