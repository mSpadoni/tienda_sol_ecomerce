import ProductosController from "../controller/productosController.js";
import express from "express";

const pathProductos = "/productos";

export default function productosRoutes(getController) {
    const router = express.Router();
    const controller = getController(ProductosController);

    router.get(pathProductos, (req, res) => controller.getProductos(req, res));
    return router;
}