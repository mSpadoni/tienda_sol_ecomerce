export default class FaltaStock extends Error {
  constructor() {
    super("No hay stock suficiente en algun producto para crear el pedido");
  }
}
