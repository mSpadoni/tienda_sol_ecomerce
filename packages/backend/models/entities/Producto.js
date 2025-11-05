import { randomUUID } from "crypto";
import Usuario from "./Usuario.js";
import Categoria from "./Categoria.js";
import { Moneda } from "./Moneda.js";

export default class Producto {
  _id;
  constructor(
    vendedor,
    titulo,
    descripcion,
    categorias,
    precio,
    moneda,
    stock,
    fotos,
    activo,
  ) {
    this.vendedor = vendedor;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.categorias = categorias;
    this.precio = precio;
    this.moneda = moneda;
    this.stock = stock;
    this.fotos = fotos;
    this.activo = activo;
  }

  estaDisponible(cantidad) {
    return this.activo && this.stock >= cantidad;
  }

  reducirStock(cantidad) {

    this.stock -= cantidad;

  }

  aumentarStock(cantidad) {
    this.stock += cantidad;
  }

  getVendedor() {
    return this.vendedor;
  }

  contieneCategoria(categoriaBuscada) {
    return this.categorias.some((categoria) => categoria == categoriaBuscada);
  }

  getTitulo() {
    return this.titulo;
  }
 
  getDescripcion() {
    return this.descripcion;
  }

  getIdVendedor() {
    return this.vendedor.getId();
  }

  getActivo() {
    return this.activo;
  }

  getPrecio() {
    return this.precio;
  }

  getVentas() {
    return this.ventas;
  }
}
