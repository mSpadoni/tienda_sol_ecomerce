import { randomInt  } from "crypto";
import Usuario from "./Usuario.js";

export default class Notificacion {
  constructor(usuario, mensaje, fechaAlta) {
    this.id = this.randomNumericId(12);
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
  
  estaLeida(){
    return this.leida === true;
  }

  randomNumericId(length = 10) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += randomInt(0, 10); // genera dígitos del 0 al 9
    }
    return result;
}
}
