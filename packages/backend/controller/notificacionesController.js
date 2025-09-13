import { z } from "zod";

const idTransform = z.string().transform(((val, ctx)  => {
    const num = Number(val);
    if (isNaN(num)) {
        ctx.addIssue({
            code: "INVALID_ID",
            message: "id must be a number"
        });
        return z.NEVER;
    }
    return num;
}))

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
    
    getNotificacionById(req, res){
        const id = this.validarId(req, res)
        const notificacion = this.notificacionesService.getNotificacionById(id);
        if (!notificacion) {
            res.status(404).json({
                error: "No existe una notificación con ese ID."
            })
            return
        }
        res.status(200).json(notificacion);
    }
    
    marcarNotificacionComoLeida(req, res){
        const id = this.validarId(req, res)
        const notificacion = this.notificacionesService.marcarNotificacionComoLeida(id);
        res.status(200).json(notificacion);
    }

    validarId(req, res){
        const resultId = idTransform.safeParse(req.params.id)
        if (resultId.error) {
            return res.status(400).json(resultId.error.issues)
        }
        return resultId.data
    }
}