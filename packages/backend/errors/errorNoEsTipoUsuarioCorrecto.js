export default class NoEsTipoUsuarioCorecto extends Error {
  constructor(tipo) {
    super(`No es del tipo: ${tipo}`);
  }
}
