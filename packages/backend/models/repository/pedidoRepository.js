import logger from "../../../logger/logger.js";
/*import pedido from "../Dominio/pedido.js";
import fs from "node:fs/promises";
import path from "node:path";*/
import { PedidoModel } from "../../schemas/PedidoSchema.js";


export default class pedidoRepository {
  constructor() {
    this.modelo = PedidoModel;
  }

  async findByUsuariosId(idUsuario) {

    logger.info(`Buscando pedidos del usuario con id: ${idUsuario} en el repo`);
    return await this.modelo
      .find({ comprador: idUsuario })
      .populate("comprador")
  .populate("items.producto") 
  .populate("historialEstado.usuario")
  
  }

  async save(pedido) {
    let pedidoDoc;

    if (pedido.id) {
     pedidoDoc = await this.modelo.findById(pedido.id).populate("comprador")
    .populate("items.producto") 
    .populate("historialEstado.usuario")

      Object.assign(pedidoDoc, pedido); 
  } else {
    pedidoDoc = new this.modelo(pedido);
  }

  return await pedidoDoc.save();
}

  async findById(id) {
    return await this.modelo
      .findById(id)
      .populate("comprador")
  .populate("items.producto") 
  .populate("historialEstado.usuario")

  }
}
