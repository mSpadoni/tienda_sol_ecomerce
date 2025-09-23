export default class NoSePuedeCancelarUnPedidoEnviado extends Error {
  constructor() {
    super("No se puede cancelar un pedido ya enviado");
  }
}
