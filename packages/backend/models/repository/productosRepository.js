import Producto from "../entities/Producto.js";

export default class ProductosRepository {
    constructor(){
        this.productos = [new Producto(
    "vendedor1",                       // vendedor
    "Camiseta Argentina",              // titulo
    "Camiseta oficial de la Selección",// descripcion
    ["Ropa", "Deportes"],              // categorias
    25000,                             // precio
    "ARS",                             // moneda
    10,                                // stock
    ["camiseta1.jpg"],                  // fotos
    true                               // activo
  ),
  new Producto(
    "vendedor2",
    "Notebook Lenovo",
    "Notebook Lenovo i5 8GB RAM 256GB SSD",
    ["Tecnología", "Computadoras"],
    650000,
    "ARS",
    5,
    ["notebook.jpg"],
    true
  ),
  new Producto(
    "vendedor1",
    "Auriculares Bluetooth",
    "Auriculares inalámbricos con cancelación de ruido",
    ["Tecnología", "Audio"],
    75000,
    "ARS",
    15,
    ["auriculares.jpg"],
    true
  ),
  new Producto(
    "vendedor3",
    "Silla Gamer",
    "Silla ergonómica con soporte lumbar",
    ["Muebles", "Gaming"],
    120000,
    "ARS",
    8,
    ["silla.jpg"],
    false
  ),
  new Producto(
    "vendedor2",
    "Pelota de fútbol",
    "Pelota tamaño 5 oficial FIFA",
    ["Deportes"],
    18000,
    "ARS",
    30,
    ["pelota.jpg"],
    true
  )
];
    }

    // Quiero crear unos productos de prueba
    crearProductosDePrueba(){
        this.productos.push(new Producto(1, "Camiseta de Algodón", "Ropa", "Camiseta cómoda y transpirable", 19.99, 101));
        this.productos.push(new Producto(2, "Auriculares Inalámbricos", "Electrónica", "Auriculares con cancelación de ruido", 89.99, 102));
        this.productos.push(new Producto(3, "Libro de Cocina", "Libros", "Recetas deliciosas y fáciles de seguir", 24.99, 103));
        this.productos.push(new Producto(4, "Zapatillas Deportivas", "Calzado", "Zapatillas ligeras y cómodas para correr", 59.99, 101));
        this.productos.push(new Producto(5, "Smartphone de Última Generación", "Electrónica", "Teléfono con cámara de alta resolución y gran rendimiento", 699.99, 104));
        this.productos.push(new Producto(6, "Mochila de Senderismo", "Accesorios", "Mochila resistente y espaciosa para tus aventuras al aire libre", 49.99, 105));
        this.productos.push(new Producto(7, "Reloj Inteligente", "Electrónica", "Reloj con monitor de actividad y notificaciones inteligentes", 199.99, 102));
        this.productos.push(new Producto(8, "Set de Pintura Acrílica", "Arte", "Colores vibrantes y pinceles de alta calidad", 29.99, 106));
    }

    getProductos(filtros, activo){
        const reglas = {
        idVendedor: (valor, productos) => this.perteneceAVendedor(valor, productos),
        nombre: (valor, productos) => this.contieneNombre(valor, productos),
        categoria: (valor, productos) => this.contieneCategoria(valor, productos),
        descripcion: (valor, productos) => this.contieneDescripcion(valor, productos),
        precioMin: (valor, productos) => this.precioMayorQue(valor, productos),
        precioMax: (valor, productos) => this.precioMenorQue(valor, productos),
    };
    let productosADevolver = this.productos;
    if (activo !== undefined) {
        productosADevolver = this.filtrarPorActivo(activo, this.productos);
    }
    return Object.entries(filtros).reduce(
        (productosADevolver, [clave, valor]) =>
            reglas[clave] ? reglas[clave](valor, productosADevolver) : productosADevolver,
        productosADevolver
    );
    }

    precioMenorQue(precio, productos) {
        return productos.filter(p => p.precio < precio)
    }

    precioMayorQue(precio, productos) {
        return productos.filter(p => p.precio > precio)
    }

    contieneNombre(nombreBuscado, productos) {
        return productos.filter(p => p.getNombre().includes(nombreBuscado))
    }

    contieneCategoria(categoria, productos) {
        return productos.filter(p => p.contieneCategoria(categoria))
    }

    contieneDescripcion(descripcionBuscada, productos) {
        return productos.filter(p => p.getDescripcion().includes(descripcionBuscada))
    }

    perteneceAVendedor(idVendedor, productos) {
        //return productos.filter(p => p.getIdVendedor() == idVendedor)
        return productos.filter(p => p.getVendedor() == idVendedor)
    }

    filtrarPorActivo(activo, productos) {
        return productos.filter(p => p.getActivo() === activo)
    }

    findByPage(filtros, activo, numeroPagina, elementosXPagina) {
        const productosFiltrados = this.getProductos(filtros, activo);
        const offsetInicio = (numeroPagina - 1) * elementosXPagina;
        const offsetFinal = offsetInicio + elementosXPagina;
        return productosFiltrados.slice(offsetInicio, offsetFinal);
    }

    contarTodos() {
        return this.productos.length;
    }
}