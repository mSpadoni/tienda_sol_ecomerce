export default class usuarioRepository {
  constructor() {
    this.usuarios = [usuarioEjemplo];
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


const usuarioEjemplo={
  id: 1,
  nombre: 'admin',
  password: 'admin',
  email: 'admin@gmail.com'
}
    
