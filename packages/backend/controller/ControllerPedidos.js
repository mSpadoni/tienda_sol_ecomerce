import Pedido from "../model/Pedido.js";
import { z } from "zod";

export default class ControllerUsuarios {
  constructor(servicePedido) {
    this.servicePedido = servicePedido;
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
