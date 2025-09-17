export default class ErrorNoEncontrado extends Error {
  constructor(id, recurso) {
    super();
    this.name = "ErrorPedidoNoEncontrado";
    this.mensaje = `No existe un ${recurso} con el id: ${id}`;
  }
}
