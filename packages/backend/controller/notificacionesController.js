export default class NotificacionesController {
    constructor(notificacionesService){
        this.notificacionesService = notificacionesService;
    }

    getNotificaciones(req,res){
        const {leida} = req.query
        let filtros = {}
        if (leida !== undefined){
            if(leida === "true"){
                filtros.leida = true
            }
            else if (leida === "false"){
                filtros.leida = false
            }
            else {
                return res.status(400).send("El parámetro 'leida' debe ser 'true' o 'false'");
            }
        }
        const notificaciones = this.notificacionesService.getNotificaciones(filtros);
        if(notificaciones === null){
            return res.status(204).send("No se encontraron notificaciones");
        }
        return res.status(200).json(notificaciones);
    }

    getNotificacionesNoLeidas(req,res){
        const notificaciones = this.notificacionesService.getNotificacionesNoLeidas();
    }
}