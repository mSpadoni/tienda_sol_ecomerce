import Producto from "../entities/Producto.js";
import fs from "node:fs/promises";
import path from "node:path";

export default class ProductosRepository {
    static productoPath = path.resolve("data", "productos.json");
    
    async getProductos(filtros, activo, sort, order){
        const data = await fs.readFile(ProductosRepository.productoPath);
        const dataObjects = await JSON.parse(data);
        const reglas = {
            idVendedor: (valor, productos) => this.perteneceAVendedor(valor, productos),
            nombre: (valor, productos) => this.contieneNombre(valor, productos),
            categoria: (valor, productos) => this.contieneCategoria(valor, productos),
            descripcion: (valor, productos) => this.contieneDescripcion(valor, productos),
            precioMin: (valor, productos) => this.precioMayorQue(valor, productos),
            precioMax: (valor, productos) => this.precioMenorQue(valor, productos),
        };

        let productosADevolver = mapToProductos(dataObjects);

        if (activo !== undefined) {
            productosADevolver = this.filtrarPorActivo(activo, productosADevolver);
        }
        const productosADevolverFiltrados = Object.entries(filtros).reduce(
            (productosADevolver, [clave, valor]) =>
                reglas[clave] ? reglas[clave](valor, productosADevolver) : productosADevolver,
            productosADevolver
        );
        return this.orderBy(productosADevolverFiltrados, sort, order);
    }
//------------Filtros----------------
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
//------------------------------------

    async findByPage(filtros, activo, numeroPagina, elementosXPagina, sort, order) {
        const offsetInicio = (numeroPagina - 1) * elementosXPagina;
        const productosFiltrados = await this.getProductos(filtros, activo, sort, order);
        const offsetFinal = offsetInicio + elementosXPagina;
        return productosFiltrados.slice(offsetInicio, offsetFinal);
    }

    async contarTodos() {
        const data = await fs.readFile(ProductosRepository.productoPath);
        const dataObjects = await JSON.parse(data);
        const productos = mapToProductos(dataObjects);
        return productos.length;
    }

    orderBy(productos, sort, order) {
        return productos.sort(tipoOrdenamiento[sort][order]);
    }

findById(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  create(producto) {
    this.productos.push(producto);
  }

  updateProducto(producto){
    const index = this.productos.findIndex((p) => p.id === producto.id)
    if (index !== -1) {
      this.productos[index].stock=producto.stock
    }
  }
}

const tipoOrdenamiento = {
    precio: {
        asc: (a, b) => a.getPrecio() - b.getPrecio(),
        desc: (a, b) => b.getPrecio() - a.getPrecio(),
    },
    ventas: {
        asc: (a, b) => a.getVentas() - b.getVentas(),
        desc: (a, b) => b.getVentas() - a.getVentas(),
    },
};


function mapToProducto(dataObject) {
    const {vendedor, titulo, descripcion, categorias, precio, moneda, stock, fotos,activo, ventas} = dataObject;
    const producto = new Producto(vendedor, titulo, descripcion, categorias, precio, moneda, stock, fotos, activo, ventas);
    producto.id = dataObject.id;
    return producto;
}

function mapToProductos(dataObjects) {
    return dataObjects.map(mapToProducto);
}
