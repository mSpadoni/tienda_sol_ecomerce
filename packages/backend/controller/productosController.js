import ErrorProductosNoEncontrados from "../errors/errorProductosNoEncontrado.js";

const activoHandler = {
  true: true,
  false: false,
};




export default class ProductosController {
  constructor(productosService) {
    this.productosService = productosService;
  }

  toDTO(producto) {
    return {
      _id: producto._id,
      vendedor: producto.vendedor,
      titulo: producto.titulo,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria,
      fotos: producto.fotos,
      stock: producto.stock,
      activo: producto.activo,
      moneda: producto.moneda,
      ventas: producto.ventas,
    };
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
        return res.sendStatus(204);
      }
      return res.status(200).json({
  ...ProductosPaginados,
  data: ProductosPaginados.data.map((producto) => this.toDTO(producto)),
});

    } catch (err) {
      next(err);
    }
  }

  async getProductoById(req, res, next) {
    try {
      const { id } = req.params;
      const producto = await this.productosService.getProductoById(id);
      if (!producto) {
        return res.sendStatus(204);
      }
      return res.status(200).json(this.toDTO(producto));
    } catch (err) {
      next(err);
    }
  }
}
