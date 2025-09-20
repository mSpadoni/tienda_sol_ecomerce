import usuario from "../Dominio/Usuario.js";

const usuario1 = new usuario(1,"Juan Perez", "juanperez@gmail.com", " ", " ", "Comprador", new Date());
const usuario2 = new usuario(2,"Ana Gomez", "anaGomez@frba.utn.edu,ar", " ", "Comprador", new Date());
const usuario3 = new usuario(3,"admin", "@gmail.com", " ", "Admin", new Date());

export default class usuarioRepository {
  constructor() {
    this.usuarios = [usuario1, usuario2, usuario3];
    this.currentId = 1;
    this.idBorrados = [];
  }
   
  findById(id) {
    return this.usuarios.find((usuario) => usuario.id === id);
  }

  findByUsernameAndPassword(username, password) {
    return this.usuarios.find(
      (usuario) => ((usuario.nombre === username || usuario.email===username) && usuario.password === password),
    );
  }
}


    
