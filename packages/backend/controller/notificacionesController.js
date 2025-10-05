import { z } from "zod";
import { NotificacionDoesNotExist } from "../errors/NotificacionDoesNotExist.js";
import mongoose from "mongoose";

const idTransform = z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
}, {
    message: "ID debe ser un ObjectId válido de MongoDB"
});

export default class NotificacionesController {
    constructor(notificacionesService){
        this.notificacionesService = notificacionesService;
    }

    async getNotificaciones(req,res){
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
        const notificaciones = await this.notificacionesService.getNotificaciones(filtros);
        if(notificaciones === null){
            return res.status(404).send("No se encontraron notificaciones");
        }
        return res.status(200).json(notificaciones);
    }
    
    async getNotificacionById(req, res){
        const validationResult = this.validarId(req.params.id)
        if (!validationResult.success) {
            return res.status(400).json(validationResult.error)
        }
        const id = validationResult.data
        const notificacion = await this.notificacionesService.getNotificacionById(id);
        if (!notificacion) {
            throw new NotificacionDoesNotExist(id);
        }
        res.status(200).json(notificacion);
    }
    
    marcarNotificacionComoLeida(req, res){
        const validationResult = this.validarId(req.params.id)
        if (!validationResult.success) {
            return res.status(400).json(validationResult.error)
        }
        const id = validationResult.data
        const notificacion = this.notificacionesService.marcarNotificacionComoLeida(id);
        res.status(200).json(notificacion);
    }

    validarId(id){
        const resultId = idTransform.safeParse(id)
        if (resultId.error) {
            return { success: false, error: resultId.error.issues }
        }
        return { success: true, data: resultId.data }
    }
}