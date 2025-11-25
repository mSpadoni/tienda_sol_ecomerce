import { ProductoModel } from "../../schemas/ProductoSchema.js";
import mongoose from "mongoose";
import logger from "../../logger/logger.js";
export default class ProductosRepository {
  constructor() {
    this.model = ProductoModel;
  }

  //------------Filtros----------------

  rangoPrecios(filtros, query) {
    const precio = {};
    if (filtros.precioMax !== undefined) precio.$lt = Number(filtros.precioMax);
    if (filtros.precioMin !== undefined) precio.$gt = Number(filtros.precioMin);
    if (Object.keys(precio).length) query.precio = precio;
  }

  contieneTitulo(filtros, query) {
    if (filtros.titulo) {
      const t = filtros.titulo;
      query.titulo = { $regex: t, $options: "i" };
    }
  }

  contieneDescripcion(filtros, query) {
    if (filtros.descripcion) {
      const d = filtros.descripcion;
      query.descripcion = { $regex: d, $options: "i" };
    }
  }

  contieneCategoria(filtros, query) {
    if (filtros.categoria) {
      const c = filtros.categoria;
      query.categoria = { $in: [c] };
    }
  }

  contieneVendedor(filtros, query) {
    if (filtros.vendedor) {
      const v = filtros.vendedor;
      if (typeof v === "string" && mongoose.Types.ObjectId.isValid(v)) {
        query.vendedor = new mongoose.Types.ObjectId(v);
      } else {
        query.vendedor = v;
      }
    }
  }

  metodosFiltros = [
    this.rangoPrecios,
    this.contieneTitulo,
    this.contieneDescripcion,
    this.contieneCategoria,
    this.contieneVendedor,
  ];

  async findByPage(
    filtros = {},
    activo,
    numeroPagina = 1,
    elementosXPagina = 10,
    sort = "ventas",
    order = "desc",
  ) {
    // Construir query a partir de filtros
    let query = {};

    // activo por parámetro separado
    if (activo !== undefined) query.activo = activo;

    this.metodosFiltros.forEach((metodo) => metodo.call(this, filtros, query));
    // Mapeo de campo de ordenamiento
    const sortFieldMap = {
      precio: "precio",
      ventas: "ventas",
    };
    const sortField = sortFieldMap[sort] || "ventas";
    const sortOrder = order === "asc" ? 1 : -1;

    const skip = Math.max(0, numeroPagina - 1) * elementosXPagina;

    // Ejecutar consulta en MongoDB (paginada y ordenada)
    const productos = await this.model
      .find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(elementosXPagina);

    return productos;
  }

  async contarTodos() {
    return await this.model.countDocuments();
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async create(producto) {
    const nuevoProducto = new this.model(producto);
    return await nuevoProducto.save();
  }

  async updateProducto(producto) {
    
    return await this.model.findByIdAndUpdate(producto._id, producto, { new: true });
  }

  async save(producto) {
    const nuevoProducto = new this.model(producto);
    return await nuevoProducto.save();
  }

  async reducirStock(id, cantidad) {
    return await this.model.findByIdAndUpdate(
      id,
      { $inc: { stock: -cantidad } },
      { new: true },
    );
  }
}