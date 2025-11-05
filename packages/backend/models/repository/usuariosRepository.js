import logger from "../../../logger/logger.js";
import { UsuarioModel } from "../../schemas/UsuarioSchema.js";

export default class usuarioRepository {
  constructor() {
    this.model = UsuarioModel;
  }

  async findById(id) {
    return await this.model.findOne({ idKeycloark: id });
  }

  async obtnerId(idKeycloark){
    return await this.model.findOne({idKeycloark:idKeycloark},"_id");
  }

  async save(usuario){
    logger.info("guardando usuario en mongo")
    const nuevoUsuario = new this.model(usuario);
    await nuevoUsuario.save();
    logger.info("usuario guardado correctamente")
  }



}
