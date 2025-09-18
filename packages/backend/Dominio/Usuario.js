import { randomUUID } from "crypto";

export class Usuario {
  constructor(nombre, email,password, telefono, tipo, fechaAlta) {
    this.id = randomUUID();
    this.nombre = nombre;
    this.password=password;
    this.email = email;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = fechaAlta;
  }
}
