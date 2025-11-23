import { NotificacionModel } from "../../schemas/NotificacionSchema.js";
//import logger from "../../logger/logger.js";
export default class NotificacionesRepository {
  constructor() {
    this.model = NotificacionModel;
  }

  async findById(id) {
    return await NotificacionModel.findById(id);
  }

  async getNotificaciones(filtros) {
    const query = {};
    if (filtros.leida !== undefined) {
      query.leida = filtros.leida;
    }
  
    const notificacionesUsuario = await NotificacionModel.find(query).populate("usuario");
    return notificacionesUsuario.filter(
      (notificacion) => notificacion.usuario.idKeycloak === filtros.usuario,
    );
  }

  async marcarNotificacionComoLeida(id,leida) {
    const notificacion = await NotificacionModel.findById(id);
    if (notificacion) {
      notificacion.leida = leida;
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
