import { CambioEstadoPedido } from "./CambioEstadoPedido";
import { ItemPedido } from "./ItemPedido";
import { Moneda } from "./Moneda";
import { Usuario } from "./Usuario";
import { DireccionEntrega } from "./DireccionEntrega";
import { EstadoPedido } from "./EstadoPedido";
import { FactoryNotificacion } from "./FactoryNotificacion";
import { randomUUID } from "crypto";

export class Pedido {
  constructor(usuario, items, moneda, direccionEntrega, fechaCreacion) {
    this.id = randomUUID();
    this.comprador = usuario;
    this.vendedor = obtenerVendedor();
    this.items = items;
    this.total = calcularTotal();
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega;
    this.estado = EstadoPedido.PENDIENTE;
    this.fechaCreacion = fechaCreacion;
    this.historialEstado = [];
    this.notificadorFactory = FactoryNotificacion.getInstance();
    notificadorFactory.crearSegunPedido(this);
  }

  calcularTotal() {
    return this.items.reduce((total, item) => {
      return total + item.subtotal();
    }, 0);
  }

  actualizarEstado(nuevoEstado, usuario, motivo) {
    this.estado = nuevoEstado;
    let cambioEstadoPedido = new CambioEstadoPedido(
      new Date(),
      nuevoEstado,
      this,
      usuario,
      motivo,
    );
    this.historialEstado.push(cambioEstadoPedido);
    //notificadorFactory.crearSegunPedido(this) A ultra chequear
  }

  validarStock() {
    return this.items.every((item) => item.estaDisponible());
  }

  obtenerVendedor() {
    return this.items[0].obtenerVendedor();
  }
}
