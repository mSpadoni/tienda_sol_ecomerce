export default class NoEsCompradorOVendedor extends Error {
  constructor(estado) {
    super("El usuario no es comprador ni vendedor");
  }
}
