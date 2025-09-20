import { randomUUID } from "crypto";

export default class Usuario {
  constructor(id,nombre, email,password, telefono, tipo, fechaAlta) {
    this.id = id;
    this.nombre = nombre;
    this.password=password;
    this.email = email;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = fechaAlta;
  }
}
