import CambioEstadoPedido from "./CambioEstadoPedido.js";
import { EstadoPedido } from "./EstadoPedido.js";
import NoSePuedeCancelarUnPedidoEnviado from "../../errors/errorNoSePuedeCancelarUnPedidoEnviado.js";
import NoSePuedeEnviarUnPedidoCancelado from "../../errors/errorNoSePuedeEnviarUnPedidoCancelado.js";
import SoloElCompradorPuedeCancelarUnPedido from "../../errors/errorSoloElCompradorPuedeCancelarUnPedido.js";
import SoloElVendedorPuedeEnviarUnPedido from "../../errors/errorSoloElVendedorPuedeEnviarUnPedido.js";
import { TipoUsuario } from "./TipoUsuario.js";
import NoEsTipoUsuarioCorecto from "../../errors/errorNoEsTipoUsuarioCorrecto.js";
import YaEstaEnEseEstado from "../../errors/errorYaEstaEnEseEstado.js";
export default class Pedido {
  id;
  constructor(usuario, items, moneda, direccionEntrega) {
    this.comprador = usuario;
    this.items = items;
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega;
    this.estado = EstadoPedido.CONFIRMADO;
    this.fechaCreacion = new Date();
    this.historialEstado = [];
  }

  calcularTotal() {
    return this.items.reduce((total, item) => {
      return total + item.subtotal();
    }, 0);
  }

  actualizarEstado(nuevoEstado, usuario, motivo) {
    // Validaciones
    if (
      nuevoEstado === EstadoPedido.CANCELADO &&
      usuario.id !== this.comprador.id
    ) {
      throw new SoloElCompradorPuedeCancelarUnPedido();
    }

    if (this.estado?.valor === nuevoEstado.valor) {
      throw new YaEstaEnEseEstado(nuevoEstado.valor);
    }

    if (
      nuevoEstado === EstadoPedido.ENVIADO &&
      usuario.id !== this.obtenerVendedor().id
    ) {
      throw new SoloElVendedorPuedeEnviarUnPedido();
    }

    if (
      this.estado === EstadoPedido.ENVIADO &&
      nuevoEstado === EstadoPedido.CANCELADO
    ) {
      throw new NoSePuedeCancelarUnPedidoEnviado();
    }

    if (
      this.estado === EstadoPedido.CANCELADO &&
      nuevoEstado === EstadoPedido.ENVIADO
    ) {
      throw new NoSePuedeEnviarUnPedidoCancelado();
    }

    // Asignación
    this.estado = nuevoEstado;

    // Crear historial
    const cambioEstadoPedido = new CambioEstadoPedido(
      new Date(),
      nuevoEstado.valor,
      this,
      usuario,
      motivo,
    );

    this.historialEstado.push(cambioEstadoPedido);
  }

  obtenerVendedor() {
    return this.items[0].obtenerVendedor();
  }
}
