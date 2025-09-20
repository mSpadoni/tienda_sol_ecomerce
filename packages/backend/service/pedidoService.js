import express from "express";

import pedidoRepository from "../repository/pedidoRepository.js";
import Pedido from "../Dominio/Pedido.js";
import logger from "../../logger/logger.js";
import { FactoryNotificacion } from "../Dominio/FactoryNotificacion.js";
import z from "zod";
import { monedaValida } from "../Dominio/Moneda.js";
import  ItemPedido  from "../Dominio/ItemPedido.js";
import { EstadoPedido } from "../Dominio/EstadoPedido.js";
import findEstado from "../Dominio/EstadoPedido.js";
import usuario from "../Dominio/Usuario.js";
import DireccionEntrega from "../Dominio/DireccionEntrega.js";


export default class pedidoService {
  constructor(repositorioPedido, repositorioUsuario, repositorioProducto, repositorioNotificacion) {
    this.repositorioPedido = repositorioPedido;
    this.repositorioUsuario = repositorioUsuario;
    this.repositorioProducto = repositorioProducto;
    this.repositorioNotificacion = repositorioNotificacion;
    
    logger.info({repositorioPedido: this.repositorioPedido.constructor.name});
    logger.info({repositorioUsuario: this.repositorioUsuario.constructor.name});
    logger.info({repositorioProducto: this.repositorioProducto.constructor.name});
    logger.info({repositorioNotificacion: this.repositorioNotificacion.constructor.name});
  }

  crear(pedidoData) {
    const usuario = this.repositorioUsuario.findById(pedidoData.usuario);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    if(new Date(pedidoData.fecha) <= new Date()){
      throw new Error("La fecha de entrega debe ser futura");
    }

    const items = [];
    pedidoData.items.forEach((item) => {
      const producto = this.repositorioProducto.findById(item.productoId);
      if (!producto || !producto.estaDisponible(item.cantidad)) {
        throw new Error(`Producto con ID ${item.productoId} no encontrado`);
      } else {
        items.push( new ItemPedido(producto,pedidoData.cantidad,producto.precio));
        producto.reducirStock(item.cantidad);
      }
    });

    if(!monedaValida(pedidoData.moneda)){
      throw new Error(`Moneda ${pedidoData.moneda} no valida`);
    }
    
    const nuevoPedido = new Pedido(
      this.repositorioPedido.generarID(),
      usuario,
      items,
      pedidoData.moneda,
      new DireccionEntrega(
      pedidoData.direccionEntrega.calle,
      pedidoData.direccionEntrega.altura,
      pedidoData.direccionEntrega.piso,
      pedidoData.direccionEntrega.departamento,
      pedidoData.direccionEntrega.codigoPostal,
      pedidoData.direccionEntrega.ciudad,
      pedidoData.direccionEntrega.provincia,
      pedidoData.direccionEntrega.pais,
      pedidoData.direccionEntrega.lat,
      pedidoData.direccionEntrega.long,),  
      pedidoData.fecha,
    );

    this.repositorioPedido.save(nuevoPedido);

    var notificacion = new FactoryNotificacion().crearSegunPedido(nuevoPedido);

    //todo: enviar notificacion

    //todo: persistir notificacion

  }

    findPedidosByUsuariosId(idUsuario) {
    logger.info(
      `Buscando pedidos del usuario con id:  ${idUsuario} en el servicio`,
    );
    const pedidos = this.repositorioPedido.findByUsuariosId(idUsuario);
    return pedidos;
  }


  async actualizar(id, pedidoData) {
    const pedidoExistente = this.repositorioPedido.findById(id); 
    if (!pedidoExistente) {
      throw new Error("Pedido no encontrado");
    }

    const estado = findEstado(pedidoData.estado);
    if (!estado) {
      throw new Error(`Estado ${pedidoData.estado} no valido`);
    }

    const usuario = this.repositorioUsuario.findById(pedidoData.usuario);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    
    pedidoExistente.actualizarEstado(estado, usuario, pedidoData.motivo);

    this.repositorioPedido.updateById(id, pedidoExistente);

    var notificacion = new FactoryNotificacion().crearSegunPedido(pedidoExistente);
    this.repositorioNotificacion.save(notificacion);

    return pedidoExistente;
  }


}


