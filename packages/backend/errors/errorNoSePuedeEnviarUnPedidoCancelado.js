export default class NoSePuedeEnviarUnPedidoCancelado extends Error {
  constructor() {
    super("No se puede enviar un pedido ya cancelado");
  }
}
