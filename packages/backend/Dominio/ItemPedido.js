import Producto from "./Producto.js";

export default class ItemPedido {
  constructor(producto, cantidad, precioUnitario) {
    this.producto = producto;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
  }

  subtotal() {
    return this.cantidad * this.precioUnitario;
  }

  estaDisponible() {
    return this.producto.estaDisponible(this.cantidad);
  }

  obtenerVendedor() {
    return this.producto.getVendedor();
  }
}
