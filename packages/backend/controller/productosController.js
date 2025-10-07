import ErrorProductosNoEncontrados from "../errors/errorProductosNoEncontrado.js";

const activoHandler = {
  true: true,
  false: false,
};

export default class ProductosController {
  constructor(productosService) {
    this.productosService = productosService;
  }

  async getProductos(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const { sort = "ventas", order = "desc" } = req.query;
    const filtros = req.query;
    const { activo } = req.query;
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
  }
}
