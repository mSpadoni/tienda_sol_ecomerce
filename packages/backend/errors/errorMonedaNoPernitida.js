export default class ErrorMonedaNoPermitida extends Error {
  constructor(moneda) {
    super(`Moneda ${moneda} no valida`);
  }
}
