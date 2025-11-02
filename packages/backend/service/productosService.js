export default class ProductosService {
  constructor(productosRepository) {
    this.productosRepository = productosRepository;
  }

  toDTO(producto) {
    return {
      vendedor: producto.vendedor,
      titulo: producto.titulo,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categorias: producto.categorias,
      fotos: producto.fotos,
      stock: producto.stock,
      activo: producto.activo,
      moneda: producto.moneda,
      ventas: producto.ventas,
    };
  }

  async getProductos(filtros, activo, page, limit, sort = "ventas", order = "desc") {
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
      data: productos.map((producto) => this.toDTO(producto)),
    };
  }
}
