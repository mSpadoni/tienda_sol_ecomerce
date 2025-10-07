export default class ErrorProductosNoEncontrados extends Error {
  constructor() {
    super("No se encontraron productos");
  }
}
