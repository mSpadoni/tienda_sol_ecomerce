import express from "express";
import ControllerPedidos from "../controller/ControllerPedidos.js";
import pedidosErrorHandler from "../middleware/pedidosMiddlewares.js";
import logger from "../../logger/logger.js";
import zodErrorHandler from "../middleware/zodMilware.js";
import {
  soloRol,
  validarToken,
} from "../middleware/autentificacionMiddlewares.js";
import { TipoUsuario } from "../models/entities/TipoUsuario.js";


  const sortPedidosVendedor = (pedidos) => {
    const estadoOrdenPrioridad = {
      confirmado: 1,
      enviado: 2,
      cancelado: 3,
      rechazado: 4,
      finalizado: 5,
    };
    return pedidos.sort((a, b) => estadoOrdenPrioridad[a.estado.valor] - estadoOrdenPrioridad[b.estado.valor]);
  }

    const sortPedidosComprador = (pedidos) => {
    const estadoOrdenPrioridad = {
      confirmado: 2,
      enviado: 1,
      rechazado: 3,
      cancelado: 4,
      finalizado: 5,
    };
    return pedidos.sort((a, b) => estadoOrdenPrioridad[a.estado.valor] - estadoOrdenPrioridad[b.estado.valor]);
  }

export default function pedidoRoute(getController) {
  const router = express.Router();
  const controler = getController(ControllerPedidos);

  const pathPedidos = "/pedidos";

  router.post(pathPedidos, validarToken, async (req, res, next) => {
    logger.http("Solicitud POST a /pedidos");
    try {
      await controler.crear(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.get(
    pathPedidos + "/hechos",
    validarToken,
    // soloRol(TipoUsuario.COMPRADOR),
    async (req, res, next) => {
      try {
        logger.http("Solicitud de pedidos del usuario id: " + req.params.id);
        await controler.findPedidosByID(req, res, (pedido, idABuscar) => pedido.comprador._id.toString() === idABuscar,sortPedidosComprador);
      } catch (err) {
        next(err);
      }
    },
  );

  router.get(
    pathPedidos + "/recibidos",
    validarToken,
    // soloRol(TipoUsuario.VENDEDOR),
    async (req, res, next) => {
      try {
        logger.http("Solicitud de pedidos del usuario id: " + req.params.id);
        await controler.findPedidosByID(req, res,(pedido, idABuscar) => pedido.items[0].producto.vendedor._id.toString() === idABuscar,sortPedidosVendedor);
      } catch (err) {
        next(err);
      }
    },
  );

  router.patch(pathPedidos + "/:id", validarToken, async (req, res, next) => {
    logger.http("Solicitud PATCH a /pedidos");
    try {
      await controler.actualizar(req, res);
    } catch (err) {
      next(err);
    }
  });

  router.use(pedidosErrorHandler);
  router.use(zodErrorHandler);
  return router;
}
