export function productosErrorHandler(err, _req, res, _next) {
    console.log(err.message);

    res.status(500).json({ error: "Ups, algo sucedió en el servidor" });
}