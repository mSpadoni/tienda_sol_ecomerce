export class CambioEstadoPedido {
  constructor(fecha, estado, pedido, usuario, motivo) {
    this.fecha = fecha;
    this.estado = estado;
    this.pedido = pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}