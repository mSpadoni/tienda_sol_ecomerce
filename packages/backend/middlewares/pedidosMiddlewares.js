import ErrorPedidoNoEncontrado from "../errors/errorNoEncontrado.js";
import logger from "../../logger/logger.js";

export default function pedidosErrorHandler(err, _req, res, _next) {
  logger.error(err.message || err.menssaje);

  if (err.constructor.name == ErrorPedidoNoEncontrado.name) {
    res.status(404).json({ error: err.menssaje});
    return;
  }

  res.status(500).json({ error: "Ups. Algo sucedio en el servidor." });
}
