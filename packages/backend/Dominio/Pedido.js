import CambioEstadoPedido from "./CambioEstadoPedido.js";
import { EstadoPedido } from "./EstadoPedido.js";
import { randomUUID } from "crypto";

export default class Pedido {
  constructor(usuario, items, moneda, direccionEntrega, fechaCreacion) {
    this.id = randomUUID();
    this.comprador = usuario;
    this.items = items;
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega;
    this.estado = EstadoPedido.PENDIENTE;
    this.fechaCreacion = fechaCreacion;
    this.historialEstado = [];
  }

  calcularTotal() {
    return this.items.reduce((total, item) => {
      return total + item.subtotal();
    }, 0);
  }

  actualizarEstado(nuevoEstado, usuario, motivo) {
    this.estado = nuevoEstado;
    const cambioEstadoPedido = new CambioEstadoPedido(
      new Date(),
      nuevoEstado,
      this,
      usuario,
      motivo,
    );
    this.historialEstado.push(cambioEstadoPedido);
    // notificadorFactory.crearSegunPedido(this);
  }

  validarStock() {
    return this.items.every((item) => item.estaDisponible());
  }

  obtenerVendedor() {
    return this.items[0].obtenerVendedor();
  }
}
