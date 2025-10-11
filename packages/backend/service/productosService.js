export default class ProductosService {
    
    constructor(productosRepository) {
        this.productosRepository = productosRepository;
    }

            //Aca como mas nos guste podemos transformar el objeto a un DTO
    toDTO(producto) {
        return {
            id: producto.id || producto._id, //validacion de if default de mongo
            vendedor: producto.vendedor,
            titulo: producto.titulo,
            descripcion: producto.descripcion,
            categorias: producto.categorias,
            precio: producto.precio,
            moneda: producto.moneda,
            stock: producto.stock,
            fotos: producto.fotos,
            activo: producto.activo,
            ventas: producto.ventas
        };
    }

    async getProductos(filtros, activo, page, limit, sort, order) {
        
        const numeroPagina = Math.max(Number(page), 1)
        const elementosXPagina = Math.min(Math.max(Number(limit), 1), 100)

        const productos = await this.productosRepository.findByPage(filtros, activo, numeroPagina, elementosXPagina, sort, order);

        const total = await this.productosRepository.contarTodos()
        const totalPaginas = Math.ceil(total / elementosXPagina)
        
        return {
            pagina: numeroPagina,
            perPage: elementosXPagina,
            total: total, 
            totalPaginas: totalPaginas,
            data: productos.map(producto => this.toDTO(producto))
        }
    }

    precioAsc(productos) { 
        return this.productosRepository.precioAsc(productos);
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