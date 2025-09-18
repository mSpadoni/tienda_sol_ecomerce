import Pedido from "../Dominio/Pedido.js";
import { z } from "zod";
import logger from "../../logger/logger.js";

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
}

const pedidoSchema = z.object({
  usuario: z.number().min(1),
  moneda: z.string().min(1),
  direccionEntrega: z.string().min(1),
  fecha: z.string().min(1), //todo:pasarlo a date
  items: z.array(z.object({
    productoId: z.string().min(1),
    cantidad: z.number().min(1)
    })
    )
})