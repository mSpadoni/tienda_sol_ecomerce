export default class NotificacionesService{
    constructor(notificacionesRepository){
        this.notificacionesRepository = notificacionesRepository;
    }

    getNotificaciones(filtros){
        return this.notificacionesRepository.getNotificaciones(filtros)
    }

    marcarNotificacionComoLeida(id){
        return this.notificacionesRepository.marcarNotificacionComoLeida(id);
    }

    getNotificacionById(id){
        return this.notificacionesRepository.findById(id);
    }
} 