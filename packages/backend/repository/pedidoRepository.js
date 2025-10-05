import logger from "../../logger/logger.js";
import {jsonPedidosEjemplo1,
      jsonPedidosEjemplo2,
      jsonPedidosEjemplo3,} from "../ejemplos.js"
/*import pedido from "../Dominio/pedido.js";
import fs from "node:fs/promises";
import path from "node:path";*/

export default class pedidoRepository {
  constructor() {
    this.pedidos = [
      jsonPedidosEjemplo1,
      jsonPedidosEjemplo2,
      jsonPedidosEjemplo3,
    ];
    this.idAponer = 1;
  }

  /*async buscarTodos() {
    
    return JSON.parse(data);
  }*/

  generarID() {
    return this.idAponer++;
  }
  async findByUsuariosId(idUsuario) {
    //const data = await this.buscarTodos();
    logger.info(`Buscando pedidos del usuario con id: ${idUsuario} en el repo`);
    return this.pedidos.filter((pedido) => pedido.comprador.id === idUsuario);
  }

  save(pedido) {
    this.pedidos.push(pedido);
  }
  findAll() {
    return this.pedidos;
  }
  findById(id) {
    return this.pedidos.find((p) => p.id === id);
  }
  deleteById(id) {
    this.pedidos = this.pedidos.filter((p) => p.id !== id);
  }
  updateById(id, updatedPedido) {
    const index = this.pedidos.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.pedidos[index].estado = updatedPedido.estado;
    }
  }
}
