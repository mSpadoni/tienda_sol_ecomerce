export default class CantNegativa extends Error{
  constructor(estado) {
    super("Los item deben tener cantidad positiva")
  }
}