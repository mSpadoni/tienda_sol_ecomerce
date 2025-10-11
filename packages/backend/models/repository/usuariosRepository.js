
import { UsuarioModel } from "../../schemas/UsuarioSchema.js";

export default class usuarioRepository {
  constructor() {
    this.model=UsuarioModel
  }

  findById(id) {
    return this.model.findById(id)
  }

}
