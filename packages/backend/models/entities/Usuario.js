<<<<<<< HEAD:packages/backend/models/entities/Usuario.js
import { randomUUID } from "crypto";
import { TipoUsuario } from "./TipoUsuario.js";

export default class Usuario {
  constructor(nombre, email, telefono, tipo, fechaAlta) {
    this.id = randomUUID();
=======
export default class Usuario {
  constructor(id, nombre, email, telefono, tipo, fechaAlta) {
    this.id = id;
>>>>>>> origin/gestion-pedidos:packages/backend/Dominio/Usuario.js
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipo = tipo;
    this.fechaAlta = fechaAlta;
  }

  getId(){
    return this.id
  }
}
