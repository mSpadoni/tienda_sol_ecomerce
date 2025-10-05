

export default class usuarioRepository {
  constructor() {
    this.usuarios = [];
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
