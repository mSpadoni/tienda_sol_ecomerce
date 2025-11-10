import logger from "../../../logger/logger.js";
/*import pedido from "../Dominio/pedido.js";
import fs from "node:fs/promises";
import path from "node:path";*/
import { PedidoModel } from "../../schemas/PedidoSchema.js";

export default class pedidoRepository {
  constructor() {
    this.modelo = PedidoModel;
  }

  async findByUsuarioId(idUsuario) {
    logger.info(idUsuario);
    const idABuscar = idUsuario._id.toString();
    logger.info(
      `Buscando pedidos donde participa el usuario con id: ${idABuscar}`,
    );

    const pedidos = await this.modelo
      .find()
      .populate("comprador")
      .populate("items.producto")
      .populate("historialEstado.usuario");

    return pedidos.filter((pedido) => {
      const compradorId = pedido.comprador._id.toString();
      const vendedorId = pedido.items[0].producto.vendedor._id.toString();
      return compradorId === idABuscar || vendedorId === idABuscar;
    });
  }

  async save(pedido) {
    let pedidoDoc;

    if (pedido.id) {
      pedidoDoc = await this.modelo
        .findById(pedido.id)
        .populate("comprador")
        .populate("items.producto")
        .populate("historialEstado.usuario");

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
      .populate("historialEstado.usuario");
  }
}
