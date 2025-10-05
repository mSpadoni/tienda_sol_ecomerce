export default class SoloElVendedorPuedeEnviarUnPedido extends Error {
  constructor() {
    super("Solo el vendedor puede enviar el pedido");
  }
}
