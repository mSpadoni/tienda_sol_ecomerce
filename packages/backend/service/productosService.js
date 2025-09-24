export default class ProductosService {
    
    constructor(productosRepository) {
        this.productosRepository = productosRepository;
    }

    getProductos(filtros, activo, page, limit) {
        
        const numeroPagina = Math.max(Number(page), 1)
        const elementosXPagina = Math.min(Math.max(Number(limit), 1), 100)

        const productos = this.productosRepository.findByPage(filtros, activo, numeroPagina, elementosXPagina);

        const total = this.productosRepository.contarTodos()
        const totalPaginas = Math.ceil(total / elementosXPagina)
        
        return {
            pagina: numeroPagina,
            perPage: elementosXPagina,
            total: total, 
            totalPaginas: totalPaginas,
            data: productos
        }
    }
}