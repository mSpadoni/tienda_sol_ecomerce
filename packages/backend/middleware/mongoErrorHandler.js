import logger from "../logger/logger.js";

export const handleMongoErrors = (error, req, res, next) => {
  logger.error("Error de MongoDB detectado:", error);

  // Errores de validación de Mongoose
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      error: "Error de validación de datos",
      details: errors,
      type: "MONGO_VALIDATION_ERROR"
    });
  }

  // Error de duplicado (clave única)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `El campo ${field} ya existe en el sistema`,
      field: field,
      type: "MONGO_DUPLICATE_ERROR"
    });
  }

  // Error de conversión de tipo
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: "Formato de dato inválido",
      field: error.path,
      type: "MONGO_CAST_ERROR"
    });
  }

  // Error de conexión a MongoDB
  if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
    return res.status(500).json({
      success: false,
      error: "Error de conexión con la base de datos",
      type: "MONGO_CONNECTION_ERROR"
    });
  }

  // Error de servidor MongoDB
  if (error.name === 'MongoServerError') {
    return res.status(500).json({
      success: false,
      error: "Error del servidor de base de datos",
      code: error.code,
      type: "MONGO_SERVER_ERROR"
    });
  }

  // Error de transacción
  if (error.name === 'MongoTransactionError') {
    return res.status(500).json({
      success: false,
      error: "Error en la transacción de base de datos",
      type: "MONGO_TRANSACTION_ERROR"
    });
  }

  // Error genérico de MongoDB
  return res.status(500).json({
    success: false,
    error: error.message || "Error desconocido de la base de datos",
    type: "MONGO_GENERIC_ERROR"
  });
};
