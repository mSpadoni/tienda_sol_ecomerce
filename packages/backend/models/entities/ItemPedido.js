import CantNegativa from "../../errors/errorCantNegativa.js"
export default class ItemPedido {
  constructor(producto, cantidad, precioUnitario) {
    if(cantidad<=0){
    throw new CantNegativa();
    }
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
