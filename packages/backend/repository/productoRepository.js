export default class ProductoRepository {
  constructor() {
    this.usuarios = [];
    this.currentId = 1;
    this.idBorrados = [];
  }


  findById(id) {
    return this.usuarios.find((usuario) => usuario.id === id);
  }

  
    create(usuario) {       
    if (this.idBorrados.length > 0) {
      usuario.id = this.idBorrados.shift();
    }
  }
}
