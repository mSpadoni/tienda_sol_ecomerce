import NotificacionesController from "../controller/notificacionesController.js";
import express from "express";

const pathNotificaciones = "/notificaciones";

export default function notificacionesRoutes(getController) {
    const router = express.Router();
    const controller = getController(NotificacionesController);

    router.get(pathNotificaciones, (req, res) => controller.getNotificaciones(req, res));
    router.get(pathNotificaciones + "/:id", (req, res) => controller.getNotificacionById(req, res));
    router.post(pathNotificaciones + "/:id/leer", (req, res) => controller.marcarNotificacionComoLeida(req, res));
    router.put(pathNotificaciones + "/:id/leer", (req, res) => controller.marcarNotificacionComoLeida(req, res));
    return router;
}