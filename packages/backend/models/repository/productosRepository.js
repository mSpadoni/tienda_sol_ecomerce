import Producto from "../entities/Producto.js";
import { ProductoModel } from "../../schemas/ProductoSchema.js";
import fs from "node:fs/promises";

export default class ProductosRepository {
  /*async getNotificaciones(filtros){
        const{leida} = filtros
        return await this.model.find(filtros).populate('notificacion');
        }*/
  constructor() {
    this.model = ProductoModel;
  }

  async getProductos(filtros, activo, sort, order) {
    const data = await fs.readFile(ProductosRepository.productoPath);
    const dataObjects = await JSON.parse(data);
    const reglas = {
      idVendedor: (valor, productos) =>
        this.perteneceAVendedor(valor, productos),
      nombre: (valor, productos) => this.contieneNombre(valor, productos),
      categoria: (valor, productos) => this.contieneCategoria(valor, productos),
      descripcion: (valor, productos) =>
        this.contieneDescripcion(valor, productos),
      precioMin: (valor, productos) => this.precioMayorQue(valor, productos),
      precioMax: (valor, productos) => this.precioMenorQue(valor, productos),
    };

    let productosADevolver = mapToProductos(dataObjects);

    if (activo !== undefined) {
      productosADevolver = this.filtrarPorActivo(activo, productosADevolver);
    }
    const productosADevolverFiltrados = Object.entries(filtros).reduce(
      (productosADevolver, [clave, valor]) =>
        reglas[clave]
          ? reglas[clave](valor, productosADevolver)
          : productosADevolver,
      productosADevolver,
    );
    return this.orderBy(productosADevolverFiltrados, sort, order);
  }
  //------------Filtros----------------
  precioMenorQue(precio, productos) {
    return productos.filter((p) => p.precio < precio);
  }

  precioMayorQue(precio, productos) {
    return productos.filter((p) => p.precio > precio);
  }

  contieneNombre(nombreBuscado, productos) {
    return productos.filter((p) => p.getNombre().includes(nombreBuscado));
  }

  contieneCategoria(categoria, productos) {
    return productos.filter((p) => p.contieneCategoria(categoria));
  }

  contieneDescripcion(descripcionBuscada, productos) {
    return productos.filter((p) =>
      p.getDescripcion().includes(descripcionBuscada),
    );
  }

  perteneceAVendedor(idVendedor, productos) {
    //return productos.filter(p => p.getIdVendedor() == idVendedor)
    return productos.filter((p) => p.getVendedor() == idVendedor);
  }

  filtrarPorActivo(activo, productos) {
    return productos.filter((p) => p.getActivo() === activo);
  }
  //------------------------------------

  async findByPage(
    filtros,
    activo,
    numeroPagina,
    elementosXPagina,
    sort,
    order,
  ) {
    const offsetInicio = (numeroPagina - 1) * elementosXPagina;
    const productosFiltrados = await this.getProductos(
      filtros,
      activo,
      sort,
      order,
    );
    const offsetFinal = offsetInicio + elementosXPagina;
    return productosFiltrados.slice(offsetInicio, offsetFinal);
  }

  async contarTodos() {
    return ProductoModel.countDocuments();
  }

  orderBy(productos, sort, order) {
    return productos.sort(tipoOrdenamiento[sort][order]);
  }

  async findById(id) {
    return await this.model.findById(id).populate("vendedor");
  }

  async create(producto) {
    await this.save(producto);
  }

  async save(producto) {
    const nuevoProducto = new ProductoModel(producto);
    return await nuevoProducto.save();
  }

  async updateProducto(producto) {
    const query = producto.id
      ? { _id: producto.id }
      : { _id: new this.model()._id };

    return await this.model
      .findOneAndUpdate(query, producto, {
        new: true,
        runValidators: true,
        upsert: true,
      })
      .populate("vendedor");
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
  const {
    vendedor,
    titulo,
    descripcion,
    categorias,
    precio,
    moneda,
    stock,
    fotos,
    activo,
    ventas,
  } = dataObject;
  const producto = new Producto(
    vendedor,
    titulo,
    descripcion,
    categorias,
    precio,
    moneda,
    stock,
    fotos,
    activo,
    ventas,
  );
  producto.id = dataObject.id;
  return producto;
}

function mapToProductos(dataObjects) {
  return dataObjects.map(mapToProducto);
}
