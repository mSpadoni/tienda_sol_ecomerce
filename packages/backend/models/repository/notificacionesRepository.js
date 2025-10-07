import { NotificacionModel } from "../../schemas/NotificacionSchema.js";

export default class NotificacionesRepository {
  constructor() {
    this.model = NotificacionModel;
  }

  async findById(id) {
    return await NotificacionModel.findById(id);
  }

  async getNotificaciones(filtros = {}) {
    return await NotificacionModel.find(filtros);
    /*
        const {leida} = filtros
        const data = await fs.readFile(NotificacionesRepository.notificacionesPath, 'utf8')
        const dataObjects = JSON.parse(data)

        let notificacionesADevolver = mapToNotificaciones(dataObjects)
        if(leida !== undefined){
            notificacionesADevolver = this.estaLeida(leida, notificacionesADevolver)
        }
        return notificacionesADevolver
        */
  }

  /*async getNotificaciones(filtros){
        const{leida} = filtros
        return await this.model.find(filtros).populate('notificacion');
    }*/

  async marcarNotificacionComoLeida(id) {
    const notificacion = await this.findById(id);
    if (notificacion) {
      notificacion.marcarComoLeida();
    }
  }

  //----------------------------------------------------------------
  estaLeida(leida, notificaciones) {
    return notificaciones.filter((n) => n.estaLeida() === leida);
  }

  async save(notificacion) {
    const nuevaNotificacion = new this.model(notificacion);
     return await nuevaNotificacion.save();
  }
}
/*
function mapToNotificacion(dataObject) {
    const { id, mensaje, fecha, leida } = dataObject;
    const notificacion = new Notificacion(id, mensaje, fecha);
    notificacion.id = dataObject.id;
    return notificacion;
}

function mapToNotificaciones(dataObjects) {
    return dataObjects.map(mapToNotificacion);
}
*/
