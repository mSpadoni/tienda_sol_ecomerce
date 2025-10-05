import ErrorProductosNoEncontrados from "../errors/errorProductosNoEncontrado.js";

export function productosErrorHandler(err, _req, res, _next) {
    console.log(err.message);

    if (err.constructor.name === ErrorProductosNoEncontrados.name) {
    res.status(404).json({ error: err.message });
    return;
  }

    res.status(500).json({ error: "Ups, algo sucedió en el servidor" });
}