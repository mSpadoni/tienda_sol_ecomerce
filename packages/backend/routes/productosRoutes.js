import ProductosController from "../controller/productosController.js";
import express from "express";
import { productosErrorHandler } from "../middleware/ProductosMiddleware.js";

const pathProductos = "/productos";

export default function productosRoutes(getController) {
    const router = express.Router();
    const controller = getController(ProductosController);

    router.get(pathProductos, async (req, res) => {
        try{
            await controller.getProductos(req, res);
        }catch(err){
            next(err);
        }
    });

    router.use(productosErrorHandler);
    return router;
}