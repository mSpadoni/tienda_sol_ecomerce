import ErrorPedidoNoEncontrado from "../errors/errorNoEncontrado.js";
import logger from "../../logger/logger.js";

export default function pedidosErrorHandler(err, _req, res, _next) {
  logger.error(err.mensaje);

  if (err.constructor.name == ErrorPedidoNoEncontrado.name) {
    res.status(404).json({ error: err.mensaje });
    return;
  }

  res.status(500).json({ error: "Ups. Algo sucedio en el servidor." });
}
