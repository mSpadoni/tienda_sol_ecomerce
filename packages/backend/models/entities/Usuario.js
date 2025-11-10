export default class Usuario {
  id;

  constructor(idKeycloak, nombre, email, telefono, tipo, fechaAlta) {
    this.idKeycloak = idKeycloak;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = fechaAlta;
  }
}
