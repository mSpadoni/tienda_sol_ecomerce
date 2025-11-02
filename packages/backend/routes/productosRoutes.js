import ProductosController from "../controller/productosController.js";
import express from "express";
import { productosErrorHandler } from "../middleware/ProductosMiddleware.js";


const pathProductos = "/productos";

export default function productosRoutes(getController) {
  const router = express.Router();
  const controller = getController(ProductosController);


  router.get(pathProductos, async (req, res, next) => {
    try {
      await controller.getProductos(req, res, next);
    } catch (err) {
      next(err);
    }
  });

  router.get(pathProductos + "/:id", async (req, res, next) => {
    try {
      await controller.getProductoById(req, res, next);
    } catch (err) {
      next(err);
    }
  });

  router.use(productosErrorHandler);
  return router;
}

