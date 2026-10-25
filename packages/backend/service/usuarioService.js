import { createUser, deleteUserFromKeycloak } from "./funcionesDelService.js";
import Usuario from "../models/entities/Usuario.js";
import logger from "../logger/logger.js";

export default class UsuarioService {
  constructor(repositorioUsuario) {
    this.repositorioUsuario = repositorioUsuario;
  }

  async crear(usuario_A_Crear) {
    logger.info("creando usuario en el service");
    let idKeycloak = null;

    // Ensure rol has a default if the frontend doesn't send it
    if (!usuario_A_Crear.rol) {
      usuario_A_Crear.rol = "comprador";
    }

    try {
      // Step 1: Create user in Keycloak first
      idKeycloak = await createUser(usuario_A_Crear);
      logger.info(`Usuario creado en Keycloak con ID: ${idKeycloak}`);

      // Step 2: Create user in MongoDB only if Keycloak succeeded
      const usuarioNuevo = new Usuario(
        idKeycloak,
        usuario_A_Crear.nombre + " " + usuario_A_Crear.apellido,
        usuario_A_Crear.email,
        usuario_A_Crear.telefono,
        usuario_A_Crear.rol,
        new Date(),
      );

      await this.repositorioUsuario.save(usuarioNuevo);
      logger.info("Usuario guardado exitosamente en MongoDB");

      return {
        success: true,
        message: "Usuario creado exitosamente",
        userId: idKeycloak
      };

    } catch (error) {
      // If Keycloak creation failed, idKeycloak will be null
      // If MongoDB failed after Keycloak succeeded, idKeycloak will have a value
      if (idKeycloak) {
        logger.info(`Error en MongoDB después de crear usuario en Keycloak, iniciando rollback inmediato para ID: ${idKeycloak}`);
        
        try {
          await deleteUserFromKeycloak(idKeycloak);
          logger.info(`Rollback inmediato exitoso: usuario ${idKeycloak} eliminado de Keycloak`);
        } catch (rollbackError) {
          logger.error(`Error crítico: No se pudo eliminar usuario ${idKeycloak} de Keycloak después del fallo:`, rollbackError);
          // Agregar información del rollback fallido al error
          error.rollbackFailed = true;
          error.rollbackTarget = idKeycloak;
          error.rollbackError = rollbackError.message;
        }
        
        // Agregar información del rollback al error original
        error.rollbackAttempted = true;
        error.rollbackTarget = idKeycloak;
      } else {
        logger.info("Error en creación de usuario en Keycloak, no se intentó guardar en MongoDB");
      }
      
      throw error;
    }
  }
}
