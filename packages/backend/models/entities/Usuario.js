export default class Usuario {
  id;
  idKeycloak;
  constructor(nombre, email, telefono, tipo, fechaAlta) {
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = fechaAlta;
  }

}
