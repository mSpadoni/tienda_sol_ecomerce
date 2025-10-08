
import { UsuarioModel } from "../../schemas/UsuarioSchema";

export default class usuarioRepository {
  constructor() {
    this.model=UsuarioModel
  }

  findById(id) {
    return this.model.findById(id)
  }

}
