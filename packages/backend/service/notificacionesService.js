export default class NotificacionesService{
    constructor(notificacionesRepository){
        this.notificacionesRepository = notificacionesRepository;
    }

    getNotificaciones(filtros){
        return this.notificacionesRepository.getNotificaciones(filtros)
    }

} 