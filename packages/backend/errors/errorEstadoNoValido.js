export default class ErrorEstadoNoValido extends Error {
  constructor(estado) {
    super(`Estado ${estado} no valido`);
  }
}
