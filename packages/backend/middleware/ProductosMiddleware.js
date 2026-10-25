import logger from "../logger/logger.js";
import ErrorProductosNoEncontrados from "../errors/errorProductosNoEncontrado.js";

export function productosMiddleware(err, _req, res, _next) {
  logger.error("Error en ProductosMiddleware: " + err.message);

  if (err.constructor.name === ErrorProductosNoEncontrados.name) {
    res.status(404).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Ups, algo sucedió en el servidor" });
}
