
import logger from "../../logger/logger.js";
import {
  createUserSchema
} from "./validacionesZOD.js";


export default class UsuarioControler {
  constructor(serviceUsuario) {
    this.serviceUsuario=serviceUsuario
  }

  async crear(req, res) {
      logger.info("creando usuario en el controler")
      const resultadoBody=createUserSchema.parse(req.body);
      logger.info("usuario validado correctamente")
      await this.serviceUsuario.crear(resultadoBody)
      logger.http("usuario creado con exito")
      return res.status(200).json({mensaje: "El usuario se creo correctamente"});
    };


  }

  
