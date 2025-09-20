export default class ErrorNoEncontrado extends Error {
  constructor(id, recurso) {
    super(`No existe un ${recurso} con el id: ${id}`);
  }
}
