import express from "express";
import { pathPedidos, pathUsuarios } from "./paths.js";
import ControllerPedidos from "../controller/ControllerPedidos.js";
import pedidosErrorHandler from "../middleware/pedidosMiddlewares.js";
import logger from "../../logger/logger.js";

export default function pedidoRoute(getController) {
  const router = express.Router();
  const controler = getController(ControllerPedidos);

  if (controler instanceof ControllerPedidos) {
    logger.info("hola");
  }

  router.post(pathPedidos, async (req, res, next) => {
    logger.http("Solicitud POST a /pedidos");
    try{
    await controler.crear(req, res);}
    catch(err){
      next(err)
    }
  });

  router.patch(pathPedidos + "/:id", async (req, res, next) => {
    logger.http("Solicitud PATCH a /pedidos");
    try {
      await controler.actualizar(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.get(pathUsuarios + "/:id" + pathPedidos, async (req, res, next) => {
    try {
      logger.http("Solicitud de pedidos del usuario id: " + req.params.id);
      await controler.findPedidosByID(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.use(pedidosErrorHandler);
  return router;
}
