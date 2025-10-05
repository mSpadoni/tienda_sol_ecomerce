export default class YaEstaEnEseEstado
 extends Error {
  constructor(estado){
    super(`El pedido ya esta en el estado ${estado}`)
  }
}