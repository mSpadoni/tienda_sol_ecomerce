export class NotificacionDoesNotExist extends Error {
  constructor(id) {
    super();
    this.message = "Notificación con id: " + id + " no existe.";
  }
}