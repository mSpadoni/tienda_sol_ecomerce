import express from "express";
import pedidosErrorHandler from "../middlewares/pedidosMiddlewares.js";
import ControllerUsuarios from "../controller/ControllerUsuarios.js";
import logger from "../../logger/logger.js";

export default function usuarioRoute(getController) {
  const router = express.Router();
  const usuariosControler = getController(ControllerUsuarios);

  router.get("/usuarios/:id/pedidos", async (req, res, next) => {
    try {
      logger.http("Solicitud de pedidos del usuario id: " + req.params.id);
      await usuariosControler.findPedidosByID(req, res);
    } catch (err) {
      next(err);
    }
  });

  /* router.post(pathUsuarios, async (req, res, next) => {
    try {
      logger.http("Solicitud de creacion de usuario: " + JSON.stringify(req.body));
      await usuariosControler.createUsuario(req, res);
    } catch (err) {
      next(err);
    }
  });*/

  router.use(pedidosErrorHandler);
  return router;
}
