import Producto from "../entities/Producto.js";
import { ProductoModel } from "../../schemas/ProductoSchema.js";
import fs from "node:fs/promises";

export default class ProductosRepository {
    
    constructor(){
        this.model = ProductoModel
    }

    async devolverProductos(){
        const productos = await this.model.find().lean();
        return productos.map(p => new Producto(p))
    }

    async getProductos(filtros = {}, activo, sort = "ventas", order = "desc") {
        const query = { ...filtros };
        if (activo !== undefined) query.activo = activo;

        let productos = await this.model.find(query);

        if (sort && order && tipoOrdenamiento[sort] && tipoOrdenamiento[sort][order]) {
            productos = productos.sort(tipoOrdenamiento[sort][order]);
        }
        return productos;
    }

//------------Filtros----------------
    precioMenorQue(precio, productos) {
        return productos.filter(p => p.precio < precio)
    }

    precioMayorQue(precio, productos) {
        return productos.filter(p => p.precio > precio)
    }

    contieneTitulo(tituloBuscado, productos) {
        return productos.filter(p => p.getTitulo().includes(tituloBuscado))
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
        const query = { ...filtros };
        if (activo !== undefined) query.activo = activo;

        console.log(query);
        let productos = await this.model
            .find(query)
            .skip((numeroPagina - 1) * elementosXPagina)
            .limit(elementosXPagina)
            .lean();

        if (sort && order && tipoOrdenamiento[sort] && tipoOrdenamiento[sort][order]) {
            productos = productos.sort(tipoOrdenamiento[sort][order]);
        }
        return productos;
    }

    async contarTodos() {
        return await this.model.countDocuments();
    }

    orderBy(productos, sort, order) {
        if (tipoOrdenamiento[sort] && tipoOrdenamiento[sort][order]) {
            return productos.sort(tipoOrdenamiento[sort][order]);
        }
        return productos;
    }

    async findById(id) {
      return await this.model.findById(id);
    }

    async create(producto) {
        const nuevoProducto = new this.model(producto);
        return await nuevoProducto.save();
    }

    async updateProducto(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async save(producto) {
        const nuevoProducto = new this.model(producto);
        return await nuevoProducto.save();
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