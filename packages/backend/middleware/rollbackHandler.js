import logger from "../logger/logger.js";
import { deleteUserFromKeycloak } from "../service/funcionesDelService.js";

export const handleUserCreationRollback = (error, req, res, next) => {
  logger.error("Error en creación de usuario, verificando necesidad de rollback:", error);

  // Si el error viene de MongoDB y ya tenemos un ID de Keycloak, hacemos rollback
  if (error.name === 'ValidationError' || 
      error.code === 11000 || 
      error.name === 'CastError' ||
      error.name === 'MongoNetworkError' ||
      error.name === 'MongoTimeoutError' ||
      error.name === 'MongoServerError') {
    
    // Extraer el ID de Keycloak del contexto si está disponible
    const keycloakId = req.keycloakUserId || error.keycloakId;
    
    if (keycloakId) {
      logger.info(`Iniciando rollback: eliminando usuario ${keycloakId} de Keycloak debido a error de MongoDB`);
      
      // Hacer rollback asíncrono pero no bloquear la respuesta
      deleteUserFromKeycloak(keycloakId)
        .then(() => {
          logger.info(`Rollback exitoso: usuario ${keycloakId} eliminado de Keycloak`);
        })
        .catch(rollbackError => {
          logger.error(`Error crítico: No se pudo eliminar usuario ${keycloakId} de Keycloak después del fallo de MongoDB:`, rollbackError);
        });
      
      // Agregar información del rollback al error
      error.rollbackAttempted = true;
      error.rollbackTarget = keycloakId;
    }
  }

  // Pasar el error al siguiente handler
  next(error);
};
