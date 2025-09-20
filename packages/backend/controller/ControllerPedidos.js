import Pedido from "../Dominio/Pedido.js";
import { string, z } from "zod";
import ErrorNoEncontrado from "../errors/errorNoEncontrado.js";
import { TipoUsuario } from "../Dominio/TipoUsuario.js";
import logger from "../../logger/logger.js";
import { id } from "zod/locales";
import CambioEstadoPedido from "../Dominio/CambioEstadoPedido.js";

export default class ControllerPedidos {
 
  constructor(servicePedido) {
    this.servicePedido = servicePedido;
    logger.info({servicePedido: this.servicePedido.constructor.name})
  }

  async crear(req, res) {
    //TODO: Validar datos de entrada
    const resultBody = pedidoSchema.safeParse(req.body);

    if (!resultBody.success) {
      logger.error("Error de validacion", { errors: resultBody.error.issues });
      return res.status(400).json({ error: resultBody.error.issues });
    }

    const nuevoPedido = await this.servicePedido.crear(resultBody.data);
    res.status(201).json(nuevoPedido);
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
      await this.servicePedido.findPedidosByUsuariosId(idUsuario);

    if (pedidos.length === 0) {
      throw new ErrorNoEncontrado(idUsuario, "Pedido que tenga un comprador");
    }

    logger.http(
      `Pedidos del usuario con id: ${idUsuario} encontrados: ${JSON.stringify(pedidos)}`,
    );

    res.status(200).json(pedidos);
  }


  async actualizar(req, res) {

    logger.info("actualizando pedido");

    const pedidoID = idTransform.safeParse(req.params.id);

    if (!pedidoID.success) {
      logger.warn(`Error de validacion del id del pedido: ${req.params.id}`);
      res.status(400).json({ error: pedidoID.error.issues});
      return;
    } 
    
    const resultBody = pedidoPatclhSchema.safeParse(req.body);

    if (!resultBody.success) {    
      logger.error("Error de validacion", { errors: resultBody.error.issues });
      return res.status(400).json({ error: resultBody.error.issues });
    }
    logger.info("Datos validados, actualizando pedido");

    const pedidosActualizados= await this.servicePedido.actualizar(pedidoID.data,resultBody.data);
    
    pedidosActualizados.historialEstado = pedidosActualizados.historialEstado.map(ce => new CambioEstadoPedido(ce.fecha,ce.estado,null,ce.usuario.id,ce.motivo));


    logger.http(`Pedido con id: ${pedidoID.data} actualizado`);
    res.status(200).json(pedidosActualizados);
  }
  
}




const pedidoPatclhSchema = z.object({
  estado: z.string().min(1),
  usuario: z.number(),
  motivo: z.string(),
});

const direccionSchema = z.object({
   calle: z.string().min(1),
   altura: z.string().min(1),
   piso: z.string(),
   departamento: z.string(),
   codigoPostal: z.string(),
   ciudad: z.string(),
   provincia: z.string(),
   pais: z.string(),
   lat: z.string(),
   long: z.string(),
})



const pedidoSchema = z.object({
  usuario: z.number().min(1),
  moneda: z.string().min(1),
  direccionEntrega: direccionSchema,
  fecha: z.iso.date(), //todo:pasarlo a date
  items: z.array(z.object({
    productoId: z.number(),
    cantidad: z.number()
    })
    )
})



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
