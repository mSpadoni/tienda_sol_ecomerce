import NotificacionesController from "../controller/notificacionesController.js";
import express from "express";
import { notificacionesErrorHandler } from "../middleware/NotificacionesMiddleware.js";
import { loggerMiddleware } from "../middleware/loggerMiddleware.js";

const pathNotificaciones = "/notificaciones";

export default function notificacionesRoutes(getController) {
  const router = express.Router();
  const controller = getController(NotificacionesController);

  router.use(loggerMiddleware);

  router.get(pathNotificaciones, async (req, res, next) => {
    try {
      await controller.getNotificaciones(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.get(pathNotificaciones + "/:id", async (req, res, next) => {
    try {
      await controller.getNotificacionById(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.patch(pathNotificaciones + "/:id/leer", (req, res) =>
    controller.marcarNotificacionComoLeida(req, res),
  );

  router.use(notificacionesErrorHandler);

  return router;
}
