export default class SoloElCompradorPuedeCancelarUnPedido extends Error {
  constructor() {
    super("Solo el comprador puede cancelar el pedido");
  }
}
