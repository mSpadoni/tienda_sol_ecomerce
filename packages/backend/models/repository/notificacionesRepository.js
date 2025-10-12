import Notificacion from "../entities/Notificacion.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NotificacionModel } from "../../schemas/NotificacionSchema.js";

export default class NotificacionesRepository {
  constructor() {
    this.model = NotificacionModel;
  }

  async findById(id) {
    return await NotificacionModel.findById(id);
  }

  // async getNotificaciones(filtros){
  //     const {leida} = filtros
  //     const data = await fs.readFile(NotificacionesRepository.notificacionesPath, 'utf8')
  //     const dataObjects = JSON.parse(data)

  //     let notificacionesADevolver = mapToNotificaciones(dataObjects)
  //     if(leida !== undefined){
  //         notificacionesADevolver = this.estaLeida(leida, notificacionesADevolver)
  //     }
  //     return notificacionesADevolver
  // }
  //----------------------------------------------------------------
  async getNotificaciones(filtros) {
    const query = {};
    if (filtros.leida !== undefined) {
      query.leida = filtros.leida;
    }
    if (filtros.usuario !== undefined) {
      query.usuario = filtros.usuario;
    }
    return await NotificacionModel.find(query).lean();
  }

  /*async getNotificaciones(filtros){
        const{leida} = filtros
        return await this.model.find(filtros).populate('notificacion');
    }*/

  // async marcarNotificacionComoLeida(id){
  //     const notificacion = await this.findById(id);
  //     if(notificacion){
  //         notificacion.marcarComoLeida();
  //     }
  // }

  async marcarNotificacionComoLeida(id) {
    const notificacion = await NotificacionModel.findById(id);
    if (notificacion) {
      notificacion.leida = true;
      notificacion.fechaLeida = new Date();
      await notificacion.save();
      return notificacion;
    }
    return null;
  }

  //----------------------------------------------------------------
  estaLeida(leida, notificaciones) {
    return notificaciones.filter((n) => n.estaLeida() === leida);
  }

  async save(notificacion) {
    const data = {
      usuario: notificacion.usuario,
      mensaje: notificacion.mensaje,
      fechaAlta: notificacion.fechaAlta,
      leida: notificacion.leida,
      fechaLeida: notificacion.fechaLeida,
    };
    const created = await NotificacionModel.create(data);
    return created;
  }
}
