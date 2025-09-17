export default class ProductosService {
    
    constructor(productosRepository) {
        this.productosRepository = productosRepository;
    }

    getProductos(filtros, activo) {
        return this.productosRepository.getProductos(filtros, activo);
    }
}