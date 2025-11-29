export default class ProductosService {
  constructor(productosRepository) {
    this.productosRepository = productosRepository;
  }

  async getProductos(
    filtros,
    activo,
    page,
    limit,
    sort = "ventas",
    order = "desc",
  ) {
    const numeroPagina = Math.max(Number(page), 1);
    const elementosXPagina = Math.min(Math.max(Number(limit), 1), 100);

    const productos = await this.productosRepository.findByPage(
      filtros,
      activo,
      numeroPagina,
      elementosXPagina,
      sort,
      order,
    );

    const total = await this.productosRepository.contarPorFiltros(filtros, activo);
    const totalPaginas = Math.ceil(total / elementosXPagina);

    return {
      pagina: numeroPagina,
      perPage: elementosXPagina,
      total: total,
      totalPaginas: totalPaginas,
      data: productos,
    };
  }

  async getProductoById(id) {
    const producto = await this.productosRepository.findById(id);
    return producto;
  }
}
