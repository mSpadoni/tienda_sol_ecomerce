import logger from "../logger/logger.js";
import FactoryNotificacion from "../models/entities/FactoryNotificacion.js";

export default class NotificacionesService {
  constructor(notificacionesRepository) {
    this.notificacionesRepository = notificacionesRepository;
    this.factoryNotificacion = new FactoryNotificacion().getInstance();
  }

  async getNotificaciones(filtros) {
    return await this.notificacionesRepository.getNotificaciones(filtros);
  }

  async marcarNotificacionComoLeida(id,leida) {
    return await this.notificacionesRepository.marcarNotificacionComoLeida(id,leida);
  }

  async crearNotificacion(pedido) {
    const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
    await this.notificacionesRepository.save(notificacion);
    return notificacion;
  }
}
