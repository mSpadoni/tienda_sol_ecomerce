import logger from "../../logger/logger.js";
import { ZodError } from "zod";

export const mensajesConocidos = {
  INVALID_ID: "El ID debe ser un número positivo",
  too_small: "El valor es demasiado pequeño",
  too_big: "El valor es demasiado grande",
  invalid_type: "Tipo de dato inválido",
  invalid_string: "Cadena inválida",
};

export default function zodErrorHandler(err, _req, res, _next) {
 
  if (err.constructor.name === ZodError.name) {
    const errores = err.issues.map((issue) => ({
      ... issue,
      ... {message: mensajesConocidos[issue.code] || issue.message}
    }));
    logger.warn(errores);
    res.status(400).json({ errors: errores });
    return;
  }
  
  res.status(500).json({ error: "Ups. Algo sucedio en el servidor." });
}

