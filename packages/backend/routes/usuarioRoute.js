import express from "express";
import usuarioControler from "../controller/usuarioControler.js";
import keycloakErrorHandler from "../middleware/loginMilware.js";
import zodErrorHandler from "../middleware/zodMilware.js";
import logger from "../../logger/logger.js";

export default function usuarioRoute(getController) {
  const router = express.Router();
  const controler = getController(usuarioControler);

  const pathUsuario = "/usuario";

  router.post(pathUsuario, async (req, res, next) => {
    try {
      logger.http("comienzo de la creacion del usuario");
      await controler.crear(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.use(keycloakErrorHandler);
  router.use(zodErrorHandler);
  return router;
}
