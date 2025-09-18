import { z } from "zod";
import ErrorNoEncontrado from "../errors/errorNoEncontrado.js";
import { TipoUsuario } from "../Dominio/TipoUsuario.js";
import logger from "../../logger/logger.js";

export default class ControllerUsuarios {
  constructor(serviceUsuarios) {
    this.serviceUsuarios = serviceUsuarios;
    logger.info({serviceUsuarios: this.serviceUsuarios.constructor.name});
  }

  async findPedidosByID(req, res) {
    logger.info(
      `Buscando pedidos del usuario con id: ${req.params.id} en el controlador`,
    );
    const resultId = idTransform.safeParse(req.params.id);

    if (!resultId.success) {
      logger.warn(`Error de validacion del id del usuario: ${req.params.id}`);
      res.status(404).json({ error: resultId.error.issues});
      return;
    }

    const idUsuario = resultId.data;

    logger.info(`Id del usuario valido: ${idUsuario}`);

    const pedidos =
      await this.serviceUsuarios.findPedidosByUsuariosId(idUsuario);

    if (pedidos.length === 0) {
      throw new ErrorNoEncontrado(idUsuario, "Pedido que tenga un comprador");
    }

    logger.http(
      `Pedidos del usuario con id: ${idUsuario} encontrados: ${JSON.stringify(pedidos)}`,
    );

    res.status(200).json(pedidos);
  }



  /*async createUsuario(req,res){
       logger.info("Validando datos para crear un usuario: "+JSON.stringify(req.body))
        const usuarioRespuesta=usuarioSchema.parse(req.body)

        if(!usuarioRespuesta.success){
            logger.warm("Error de validacion al crear un usuario: "+JSON.stringify(formatearErroresZod(usuarioRespuesta.error)))
            throw new ErroresDelCuerpo(usuarioRespuesta.error)
        }

        const usuarioData=usuarioRespuesta.data

        logger.info("Datos validos para crear un usuario: "+JSON.stringify(usuarioData))

        const usuarioCreado=await this.serviceUsuarios.createUsuario(usuarioData)
         
        logger.http("Usuario creado con exito: "+JSON.stringify(usuarioCreado))

        res.status(201).json(usuarioCreado) 
    }*/
}

const idTransform = z.string().transform((val, ctx) => {
  const num = Number(val);
  if (isNaN(num)) {
    ctx.addIssue({
      code: "INVALID_ID",
      message: "id must be a number",
    });
    return z.NEVER;
  }
  if (num <= 0) {
    ctx.addIssue({
      code: "INVALID_ID",
      message: "id must be a positive",
    });
    return z.NEVER;
  }
  return num;
});

export const usuarioSchema = z.object({
  nombre: z.string().min(1),
  email: z.string().email(),
  direccion: z.string().min(1),
  telefono: z.string().min(1),
  tipo: z.enum(Object.values(TipoUsuario)),
});
