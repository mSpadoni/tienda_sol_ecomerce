import { z } from "zod";
import { NotificacionDoesNotExist } from "../errors/NotificacionDoesNotExist.js";
import mongoose from "mongoose";
import logger from "../logger/logger.js";


const idTransform = z.string().refine(
  (val) => {
    return mongoose.Types.ObjectId.isValid(val);
  },
  {
    message: "ID debe ser un ObjectId válido de MongoDB",
  },
);

export default class NotificacionesController {
  constructor(notificacionesService) {
    this.notificacionesService = notificacionesService;
  }

  async getNotificaciones(req, res) {
    const { leida } = req.query;
    let filtros = {};
    if (leida !== undefined) {
      if (leida === "true") {
        filtros.leida = true;
      } else if (leida === "false") {
        filtros.leida = false;
      } else {
        return res
          .status(400)
          .send("El parámetro 'leida' debe ser 'true' o 'false'");
      }
    }

    filtros.usuario = req.user.sub;
    
    const notificaciones =
      await this.notificacionesService.getNotificaciones(filtros);
    
    if (notificaciones.lenght === 0) {
      return res.status(204).send(notificaciones);
    }
    return res.status(200).json(notificaciones);
  }

  async marcarNotificacionComoLeida(req, res) {
    const validationResult = this.validarId(req.params.idNotificacion);
    if (!validationResult.success) {
      return res.status(400).json(validationResult.error);
    }
    
    const bodyValidation = bodyCorecto.parse(req.body);
    const leida = bodyValidation.leida;
    logger.info(`Marcar notificación ${validationResult.data} como leída: ${leida}`);
    const id = validationResult.data;
    const notificacion =
      await this.notificacionesService.marcarNotificacionComoLeida(id,leida);
    if (!notificacion) {
      return res.status(204).send([]);
    }
    res.status(200).json([notificacion]);
  }

  validarId(id) {
    const resultId = idTransform.safeParse(id);
    if (resultId.error) {
      return { success: false, error: resultId.error.issues };
    }
    return { success: true, data: resultId.data };
  }
}

const bodyCorecto= z.object({
      leida:z.boolean()
    })
