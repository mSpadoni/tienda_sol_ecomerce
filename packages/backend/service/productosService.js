export default class ProductosService {
  constructor(productosRepository) {
    this.productosRepository = productosRepository;
  }

  async getProductos(filtros, activo, page, limit, sort, order) {
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

    const total = await this.productosRepository.contarTodos();
    const totalPaginas = Math.ceil(total / elementosXPagina);

    return {
      pagina: numeroPagina,
      perPage: elementosXPagina,
      total: total,
      totalPaginas: totalPaginas,
      data: productos,
    };
  }

  precioAsc(productos) {
    return this.productosRepository.precioAsc(productos);
  }

  precioDesc(productos) {
    return this.productosRepository.precioAsc(productos);
  }

  masVendidos(productos) {
    return this.productosRepository.masVendidos(productos);
  }

  menosVendidos(productos) {
    return this.productosRepository.menosVendidos(productos);
  }
}
