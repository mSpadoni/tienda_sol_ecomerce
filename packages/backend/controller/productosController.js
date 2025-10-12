import { z } from "zod";
import { idTransform } from "./validacionesZOD.js";
import ErrorProductosNoEncontrados from "../errors/errorProductosNoEncontrado.js";

const activoHandler = {
  true: true,
  false: false,
};

export default class ProductosController {
  constructor(productosService) {
    this.productosService = productosService;
  }

  async getProductos(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "ventas",
        order = "desc",
        activo,
        ...filtros
      } = req.query;
      const activoFinal = activoHandler[activo];
      const ProductosPaginados = await this.productosService.getProductos(
        filtros,
        activoFinal,
        page,
        limit,
        sort,
        order,
      );
      if (ProductosPaginados === null) {
        throw new ErrorProductosNoEncontrados();
      }
      return res.status(200).json(ProductosPaginados);
    } catch (err) {
      next(err);
    }
  }
}
