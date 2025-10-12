import { randomInt } from "crypto";
import Usuario from "./Usuario.js";

export default class Notificacion {
  constructor(usuario, mensaje, fechaAlta) {
    this.usuario = usuario;
    this.mensaje = mensaje;
    this.fechaAlta = fechaAlta;
    this.leida = false;
    this.fechaLeida = null;
  }

  marcarComoLeida() {
    this.leida = true;
    this.fechaLeida = new Date();
  }

  estaLeida() {
    return this.leida === true;
  }
}
