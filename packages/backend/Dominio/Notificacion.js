import { randomUUID } from "crypto";

export default class Notificacion {
  constructor(usuario, mensaje, fechaAlta) {
    this.id = randomUUID();
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
}
