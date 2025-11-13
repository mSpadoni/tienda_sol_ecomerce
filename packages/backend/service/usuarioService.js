import { createUser } from "./funcionesDelService.js";
import Usuario from "../models/entities/Usuario.js";
import logger from "../../logger/logger.js";

export default class UsuarioService {
  constructor(repositorioUsuario) {
    this.repositorioUsuario = repositorioUsuario;
  }

  async crear(usuario_A_Crear) {
    logger.info("creando usuario en el service");

    const idKeycloack = await createUser(usuario_A_Crear);

    const usuarioNuevo = new Usuario(
      idKeycloack,
      usuario_A_Crear.nombre + " " + usuario_A_Crear.apellido,
      usuario_A_Crear.email,
      usuario_A_Crear.telefono,
      usuario_A_Crear.rol,
      new Date(),
    );

    await this.repositorioUsuario.save(usuarioNuevo);
  }
}
