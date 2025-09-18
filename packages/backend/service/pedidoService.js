import express from "express";

import pedidoRepository from "../repository/pedidoRepository.js";
import Pedido from "../Dominio/Pedido.js";
import logger from "../../logger/logger.js";
import { FactoryNotificacion } from "../Dominio/FactoryNotificacion.js";
export default class pedidoService {
  constructor(repositorioPedido, repositorioUsuario, repositorioProducto) {
    this.repositorioPedido = repositorioPedido;
    this.repositorioUsuario = repositorioUsuario;
    this.repositorioProducto = repositorioProducto;
    logger.info({repositorioPedido: this.repositorioPedido.constructor.name});
    logger.info({repositorioUsuario: this.repositorioUsuario.constructor.name});
    logger.info({repositorioProducto: this.repositorioProducto.constructor.name});
  }

  crear(pedidoData) {
    const usuario = this.repositorioUsuario.findById(pedidoData.usuario);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    const items = [];
    pedidoData.items.forEach((item) => {
      const producto = this.repositorioProducto.findById(item.productoId);
      if (!producto || !producto.estaDisponible(item.cantidad)) {
        throw new Error(`Producto con ID ${item.productoId} no encontrado`);
      } else {
        items.push({
          producto,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
        });
      }
    });

    const nuevoPedido = new Pedido(
      usuario,
      items,
      pedidoData.moneda,
      pedidoData.direccionEntrega,
      pedidoData.fecha,
    );

    this.repositorioPedido.save(nuevoPedido);

    notificacion = new FactoryNotificacion().crearSegunPedido(nuevoPedido);

    //todo: enviar notificacion

    //todo: persistir notificacion
  }


}
