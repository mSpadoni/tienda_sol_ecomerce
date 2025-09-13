import Notificacion from "../entities/Notificacion.js";

export default class NotificacionesRepository {

    constructor(){
        this.notificaciones = []
        const noti1 = new Notificacion(null,"Tienes un nuevo pedido de Juan Perez",new Date())
        const noti2 = new Notificacion(null,"El pedido #1234 esta en camino",new Date())
        noti2.leida = true
        this.notificaciones.push(noti1)
        this.notificaciones.push(noti2)
    }

    getNotificaciones(filtros){
        const {leida} = filtros
        if(leida === undefined){
            return this.notificaciones
        }
        return this.notificaciones.filter(n => n.estaLeida() === leida)
    }

    marcarNotificacionComoLeida(id){
        const notificacion = this.findById(id);
        if(notificacion){
            notificacion.marcarComoLeida;
        }
    }
    findById(id){
        return this.notificaciones.find(n => n.id === id);
    }
}