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
    const resultBody = alojamientoSchema.safeParse(body);

    if (!resultBody.success) {
      return res.status(400).json({ error: resultBody.error.issues });
    }

    const nuevoPedido = await this.servicePedido.crear(resultBody.data);
    res.status(201).json(nuevoPedido);
  }
}
