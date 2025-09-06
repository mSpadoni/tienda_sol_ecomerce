import { randomUUID } from "crypto";
import { TipoUsuario } from "./TipoUsuario";

export class Usuario {
  constructor(nombre, email, telefono, tipo, fechaAlta) {
    this.id = randomUUID();
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = fechaAlta;
  }
}
