import logger from "../logger/logger.js";

export const handleKeycloakErrors = (error, req, res, next) => {
  logger.error("Error de Keycloak detectado:", error);

  // Errores específicos de Keycloak
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 409:
        // Conflict - usuario ya existe
        return res.status(409).json({
          success: false,
          error: "El usuario o email ya existe en el sistema",
          type: "KEYCLOAK_USER_EXISTS"
        });

      case 400:
        // Bad Request - datos inválidos
        return res.status(400).json({
          success: false,
          error: data?.errorMessage || "Datos de usuario inválidos para Keycloak",
          type: "KEYCLOAK_INVALID_DATA"
        });

      case 401:
        // Unauthorized - problema de autenticación del admin
        return res.status(500).json({
          success: false,
          error: "Error de configuración del servidor de autenticación",
          type: "KEYCLOAK_AUTH_ERROR"
        });

      case 403:
        // Forbidden - no tienes permisos
        return res.status(500).json({
          success: false,
          error: "Error de permisos en el servidor de autenticación",
          type: "KEYCLOAK_PERMISSION_ERROR"
        });

      case 404:
        // Not Found - realm o cliente no encontrado
        return res.status(500).json({
          success: false,
          error: "Configuración del servidor de autenticación no encontrada",
          type: "KEYCLOAK_NOT_FOUND"
        });

      default:
        return res.status(500).json({
          success: false,
          error: `Error del servidor de autenticación: ${data?.errorMessage || error.message}`,
          type: "KEYCLOAK_UNKNOWN_ERROR"
        });
    }
  }

  // Errores de red o conexión
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return res.status(500).json({
      success: false,
      error: "No se puede conectar con el servidor de autenticación",
      type: "KEYCLOAK_CONNECTION_ERROR"
    });
  }

  // Otros errores de Keycloak
  return res.status(500).json({
    success: false,
    error: error.message || "Error desconocido del servidor de autenticación",
    type: "KEYCLOAK_GENERIC_ERROR"
  });
};
