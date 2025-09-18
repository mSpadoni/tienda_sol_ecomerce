import express from "express";
import { pathPedidos } from "./paths.js";
import ControllerPedidos from "../controller/ControllerPedidos.js";
import pedidosErrorHandler from "../middlewares/pedidosMiddlewares.js";
import logger from "../../logger/logger.js";

export default function pedidoRoute(getController) {
  const router = express.Router();
  const controler = getController(ControllerPedidos);
  
  if (controler instanceof ControllerPedidos) {
    logger.info("hola");
  }

  router.post(pathPedidos, async (req, res,next) => {

      logger.http("Solicitud POST a /pedidos");
      await controler.crear(req, res);
  });
  


  return router;
}
