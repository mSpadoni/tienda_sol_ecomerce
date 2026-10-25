import logger from "../logger/logger.js";

const logAxiosKeycloakError = (error) => {
  logger.error("===== KEYCLOAK/Axios ERROR =====");

  if (error.response) {
    logger.error("📡 SERVER RESPONSE:");
    logger.error("Status: " + error.response.status);
    logger.error("StatusText: " + error.response.statusText);
    logger.error("Data: " + JSON.stringify(error.response.data, null, 2));
    return;
  }

  if (error.request) {
    logger.error("❌ NO RESPONSE FROM SERVER");
    logger.error("Request:", error.request);
    return;
  }

  logger.error("⚠️ REQUEST CONFIG ERROR");
  logger.error("Message: " + error.message);
};

export function loginMilware(err, req, res, next) {
  const isAxios = !!err.isAxiosError;
  const response = err?.response;
  const kc = response?.data;
  const status = response?.status;

  logger.error("======= Keycloak/Axios Error Capturado =======");
  logAxiosKeycloakError(err);

  // ============================
  // KEYCLOAK: token inválido
  // ============================
  if (
    kc?.error === "invalid_grant" ||
    kc?.error_description?.includes("Invalid")
  ) {
    return res.status(401).json({
      error: "TOKEN_INVALIDO",
      message: "Token inválido o expirado al autenticar con Keycloak.",
    });
  }

  // ============================
  // KEYCLOAK: realm/cliente mal config
  // ============================
  if (status === 404) {
    return res.status(404).json({
      error: "CONFIGURACION_KEYCLOAK",
      message: "Realm o cliente Keycloak no encontrado.",
    });
  }

  // ============================
  // KEYCLOAK: usuario duplicado
  // ============================
  if (status === 409) {
    return res.status(409).json({
      error: "USUARIO_DUPLICADO",
      message: "El usuario o email ya existe en el sistema.",
    });
  }

  // ============================
  // KEYCLOAK: política de contraseña
  // ============================
  if (kc?.errorMessage?.toLowerCase?.().includes("password")) {
    return res.status(400).json({
      error: "PASSWORD_RECHAZADA",
      message: "La contraseña no cumple con las políticas de seguridad.",
    });
  }

  // ============================
  // ROL falló luego de crear usuario
  // ============================
  if (err.message?.includes("role") || kc?.errorMessage?.includes("role")) {
    return res.status(500).json({
      error: "ERROR_ASIGNAR_ROL",
      message:
        "Usuario creado pero falló asignación de rol. Contacte a soporte.",
    });
  }

  // ============================
  // Keycloak caído
  // ============================
  if (isAxios && err.code === "ECONNREFUSED") {
    return res.status(503).json({
      error: "KEYCLOAK_NO_DISPONIBLE",
      message: "No se puede conectar con el servidor de autenticación.",
    });
  }

  // ============================
  // Timeout / DNS
  // ============================
  if (["ETIMEDOUT", "EAI_AGAIN"].includes(err.code)) {
    return res.status(504).json({
      error: "TIMEOUT_SERVIDOR",
      message: "Keycloak no respondió a tiempo.",
    });
  }

  // ============================
  // Respuesta inesperada
  // ============================
  if (isAxios && !kc) {
    return res.status(500).json({
      error: "RESPUESTA_INVALIDA_KEYCLOAK",
      message: "Keycloak devolvió una respuesta inesperada.",
    });
  }

  next(err);
}
