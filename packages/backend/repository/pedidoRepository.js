import logger from "../../logger/logger.js";
import Pedido from "../model/Pedido.js";
/*import pedido from "../Dominio/pedido.js";
import fs from "node:fs/promises";
import path from "node:path";*/
export default class pedidoRepository {
  constructor() {
    this.pedidos = [
      jsonPedidosEjemplo,
      jsonPedidosEjemplo2,
      jsonPedidosEjemplo3,
    ];
  }

  /*async buscarTodos() {
    
    return JSON.parse(data);
  }*/

  async findByUsuariosId(idUsuario) {
    //const data = await this.buscarTodos();
    logger.info(`Buscando pedidos del usuario con id: ${idUsuario} en el repo`);
    return this.pedidos.filter((pedido) => pedido.usuario.id === idUsuario);
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
      this.pedidos[index] = { ...this.pedidos[index], ...updatedPedido };
    }
  }
}

const jsonPedidosEjemplo = {
  id: 1,
  fecha: "2023-10-01",
  total: 100.0,
  usuario: { id: 1, nombre: "Juan Perez", email: " " },
};

const jsonPedidosEjemplo2 = {
  id: 1,
  fecha: "2023-10-01",
  total: 100.0,
  usuario: { id: 2, nombre: "Juan Perez", email: " " },
};

const jsonPedidosEjemplo3 = {
  id: 1,
  fecha: "2023-10-01",
  total: 100.0,
  usuario: { id: 2, nombre: "Juan Perez", email: " " },
};
