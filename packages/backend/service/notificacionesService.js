import logger from "../../logger/logger.js";
import FactoryNotificacion from "../models/entities/FactoryNotificacion.js";

export default class NotificacionesService{
    constructor(notificacionesRepository){
        this.notificacionesRepository = notificacionesRepository;
        this.factoryNotificacion = new FactoryNotificacion().getInstance();
    }

    async getNotificaciones(filtros){
        const notificaciones = await this.notificacionesRepository.getNotificaciones(filtros);
        return notificaciones;
    }

    async marcarNotificacionComoLeida(id){
        await this.notificacionesRepository.marcarNotificacionComoLeida(id);
    }

    async getNotificacionById(id){
        const notificacion = await this.notificacionesRepository.findById(id);
        return notificacion;
    }

    crearNotificacion(pedido) {
    const notificacion = this.factoryNotificacion.crearSegunPedido(pedido);
    logger.info(`${JSON.stringify(notificacion)}`);
    this.notificacionesRepository.save(notificacion);
    logger.info(`Notificacion creada: ${JSON.stringify(notificacion)}`);
    return notificacion;
  }

} 