import findEstado from "./EstadoPedido.js";

export default class CambioEstadoPedido {
  constructor(fecha, estado, pedido, usuario, motivo) {
    const estadoObjeto = findEstado(estado);
    this.fecha = fecha;
    this.estado = estadoObjeto;
    this.pedido = pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}
