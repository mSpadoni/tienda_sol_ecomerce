export default class NotificacionesService{
    constructor(notificacionesRepository){
        this.notificacionesRepository = notificacionesRepository;
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
} 