import express from "express";
import usuarioControler from "../controller/usuarioControler.js";
import { 
  handleKeycloakErrors, 
  handleMongoErrors, 
  zodMiddleware 
} from "../middleware/index.js";
import logger from "../logger/logger.js";

export default function usuarioRoute(getController) {
  const router = express.Router();
  const controler = getController(usuarioControler);

  const pathUsuario = "/usuario";

  // Middleware para capturar el ID de Keycloak si está disponible en el request
  const captureKeycloakId = (req, res, next) => {
    if (req.body.keycloakId) {
      req.keycloakUserId = req.body.keycloakId;
    }
    next();
  };

  router.post(pathUsuario, captureKeycloakId, async (req, res, next) => {
    logger.http("comienzo de la creacion del usuario");
    
    try {
      await controler.crear(req, res);
    } catch (error) {
      // Capturar el ID de Keycloak si está disponible en el error
      if (error.keycloakId) {
        req.keycloakUserId = error.keycloakId;
      }
      next(error);
    }
  });

  // Order matters: specific handlers, then generic
  router.use(handleKeycloakErrors);
  router.use(handleMongoErrors);
  router.use(zodMiddleware);
  
  // Generic error handler as fallback
  router.use((error, req, res, next) => {
    logger.error("Error no manejado específicamente:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      type: "GENERIC_ERROR",
      rollbackAttempted: error.rollbackAttempted || false
    });
  });

  return router;
}
