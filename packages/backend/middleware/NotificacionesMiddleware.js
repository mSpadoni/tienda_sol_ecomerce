import { NotificacionDoesNotExist } from "../errors/NotificacionDoesNotExist.js";
export function notificacionesErrorHandler(err, _req, res, _next) {
  console.log(err.message);

  if (err.constructor.name === NotificacionDoesNotExist.name) {
    res.status(404).json({ id: err.id, message: err.message });
    return;
  }

  res.status(500).json({ error: "Ups, algo sucedió en el servidor" });
}
