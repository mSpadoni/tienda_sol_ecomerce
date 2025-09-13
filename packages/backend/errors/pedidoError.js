export class PedidoError extends Error {
  constructor(message) {
    super(message);
    this.name = "PedidoError";
  }
}