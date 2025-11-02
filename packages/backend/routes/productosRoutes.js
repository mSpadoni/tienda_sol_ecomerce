import ProductosController from "../controller/productosController.js";
import express from "express";
import { productosErrorHandler } from "../middleware/ProductosMiddleware.js";


const pathProductos = "/productos";

export default function productosRoutes(getController) {
  const router = express.Router();
  const controller = getController(ProductosController);


  router.get(pathProductos, async (req, res, next) => {
    try {
      console.log('[DEBUG] Incoming request to /productos: ', req.query);
      await controller.getProductos(req, res, next);
    } catch (err) {
      next(err);
    }
  });

  router.use(productosErrorHandler);
  return router;
}

