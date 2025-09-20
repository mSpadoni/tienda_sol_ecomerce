import CambioEstadoPedido from "./CambioEstadoPedido.js";
import { EstadoPedido } from "./EstadoPedido.js";
import { randomUUID } from "crypto";

export default class Pedido {
  constructor(id,usuario, items, moneda, direccionEntrega, fechaCreacion) {
    this.id = id;
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
    if (nuevoEstado===EstadoPedido.CANCELADO && usuario.id != this.comprador.id){
      throw new Error("Solo el comprador puede cancelar el pedido");
    }
     if (nuevoEstado===EstadoPedido.ENVIADO && usuario.id !=this.obtenerVendedor().id) {
      throw new Error("Solo el vendedor puede enviar el pedido");
    }

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
