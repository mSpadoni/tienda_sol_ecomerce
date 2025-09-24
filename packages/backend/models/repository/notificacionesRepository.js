import Notificacion from "../entities/Notificacion.js";
import data from "../../data/notificaciones.json" with { type: "json" }
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default class NotificacionesRepository {
    static notificacionesPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../data/notificaciones.json");
    
    async getNotificaciones(filtros){
        const {leida} = filtros
        const data = await fs.readFile(NotificacionesRepository.notificacionesPath, 'utf8')
        const dataObjects = JSON.parse(data)

        let notificacionesADevolver = mapToNotificaciones(dataObjects)
        if(leida !== undefined){
            notificacionesADevolver = this.estaLeida(leida, notificacionesADevolver)
        }
        return notificacionesADevolver
    }

    async marcarNotificacionComoLeida(id){
        const notificacion = await this.findById(id);
        if(notificacion){
            notificacion.marcarComoLeida();
        }
    }

    async findById(id){
        const data = await fs.readFile(NotificacionesRepository.notificacionesPath)
        const dataObjects = await JSON.parse(data)
        const notificaciones = mapToNotificaciones(dataObjects)
        const notificacion = notificaciones.find(n => n.id === id);
        return notificacion;
    }

//----------------------------------------------------------------
    estaLeida(leida, notificaciones){
        return notificaciones.filter(n => n.estaLeida() === leida)
    }
}

function mapToNotificacion(dataObject) {
    const { id, mensaje, fecha, leida } = dataObject;
    const notificacion = new Notificacion(id, mensaje, fecha);
    notificacion.leida = leida;
    return notificacion;
}

function mapToNotificaciones(dataObjects) {
    return dataObjects.map(mapToNotificacion);
}
