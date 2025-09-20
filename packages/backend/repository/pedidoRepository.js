import logger from "../../logger/logger.js";
import Pedido from "../Dominio/Pedido.js";
import Usuario from "../Dominio/Usuario.js";
import DireccionEntrega from "../Dominio/DireccionEntrega.js";
/*import pedido from "../Dominio/pedido.js";
import fs from "node:fs/promises";
import path from "node:path";*/

const direccion=new DireccionEntrega("Calle Falsa","123","1","A","1000","Ciudad","Provincia", "-34.6037", "-58.3816","","");

const jsonPedidosEjemplo1 = new Pedido (1,new Usuario(1,"Juan Perez", "juanperez@gmail.com", " ", " ", "Comprador", new Date()),[],"Peso Argentino",direccion, new Date());
const jsonPedidosEjemplo2 = new Pedido (2,new Usuario(2,"Ana Gomez", "anaGomez@frba.utn.edu,ar", " ", "Comprador", new Date()),[], "Peso Argentino",direccion, new Date());
const jsonPedidosEjemplo3 = new Pedido (3,new Usuario(2,"Ana Gomez", "anaGomez@frba.utn.edu,ar", " ", "Comprador", new Date()),[], "Peso Argentino",direccion, new Date());



export default class pedidoRepository {
  constructor() {
    this.pedidos = [
      jsonPedidosEjemplo1,
      jsonPedidosEjemplo2,
      jsonPedidosEjemplo3,
    ];
    this.idAponer=1
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
      this.pedidos[index] = { ...this.pedidos[index], ...updatedPedido };
    }
  }
}

