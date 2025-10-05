
import {usuario1, usuario2, usuario3, usuario4 } from "../ejemplos.js";


export default class usuarioRepository {
  constructor() {
    this.usuarios = [usuario1, usuario2, usuario3, usuario4];
    this.currentId = 1;
    this.idBorrados = [];
  }

  findById(id) {
    return this.usuarios.find((usuario) => usuario.id === id);
  }

  findByUsernameAndPassword(username, password) {
    return this.usuarios.find(
      (usuario) =>
        (usuario.nombre === username || usuario.email === username) &&
        usuario.password === password,
    );
  }
}
