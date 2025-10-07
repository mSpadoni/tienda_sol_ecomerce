import Pedido from "../models/entities/Pedido.js";
import logger from "../../logger/logger.js";
import {
  reducirStocks,
  aumentarStocks,
  obtenerDireccion,
  validarStock,
  obtenerEstado,
  monedaValida
} from "./funcionesDelService.js";
import { EstadoPedido } from "../models/entities/EstadoPedido.js";
import ItemPedido from "../models/entities/ItemPedido.js";
import ErrorNoEncontrado from "../errors/errorNoEncontrado.js";


export default class pedidoService {
  constructor(repositorioPedido, repositorioUsuario, repositorioProducto) {
    this.repositorioPedido = repositorioPedido;
    this.repositorioUsuario = repositorioUsuario;
    this.repositorioProducto = repositorioProducto;

    logger.info({ repositorioPedido: this.repositorioPedido.constructor.name });
    logger.info({
      repositorioUsuario: this.repositorioUsuario.constructor.name,
    });
    logger.info({
      repositorioProducto: this.repositorioProducto.constructor.name,
    });
  }

  async crear(pedidoData) {
    const usuario = await this.obtenerUsuario(pedidoData.usuario);
    logger.info(`${JSON.stringify(usuario)}`)
    let items = await this.obtenerItems(pedidoData);
    logger.info(`${JSON.stringify(items)}`);
    const moneda = monedaValida(pedidoData.moneda);
    validarStock(items);
    items = await this.actualizarStock(items, EstadoPedido.PENDIENTE);

    logger.info(`${JSON.stringify(items)}`);
    

    const direccionEntrega = obtenerDireccion(pedidoData);
    const nuevoPedido = new Pedido(usuario, items, moneda, direccionEntrega);
    const pedidoRespuesta=await this.repositorioPedido.save(nuevoPedido);                         
    return pedidoRespuesta;
  }

  async findPedidosByUsuariosId(idUsuario) {
    logger.info(
      `Buscando pedidos del usuario con id:  ${idUsuario} en el servicio`,
    );

    const pedidos = await this.repositorioPedido.findByUsuariosId(idUsuario);
    logger.info(`${JSON.stringify(pedidos)}`);
    if (pedidos.length === 0) {
      throw new ErrorNoEncontrado(idUsuario, "Pedido que tenga un comprador");
    }
    return pedidos;
  }

  async actualizar(id, pedidoData) {
    console.log("hola")
    const pedidoExistente = await this.obtenerPedido(id);

    const usuario = await this.obtenerUsuario(pedidoData.usuario);
     logger.info(`${JSON.stringify(pedidoData.estado)}`)
    const estado = obtenerEstado(pedidoData.estado);
    
    pedidoExistente.actualizarEstado(estado, usuario, pedidoData.motivo);
    logger.info(`${JSON.stringify(pedidoExistente.estado)}`)
    pedidoExistente.items = await this.actualizarStock(
      pedidoExistente.items,
      pedidoExistente.estado
    );
    const pedidoActualizado=await this.repositorioPedido.save(pedidoExistente);

    return pedidoActualizado;
  }

  async obtenerUsuario(idUsuario) {
    const usuario = await this.repositorioUsuario.findById(idUsuario);
    if (!usuario) {
      throw new ErrorNoEncontrado(idUsuario, "ususario ");
    }
    return usuario;
  }

  async obtenerPedido(PedidoId) {
    const pedidoExistente = await this.repositorioPedido.findById(PedidoId);
    if (!pedidoExistente) {
      throw new ErrorNoEncontrado(PedidoId, "pedido");
    }
    return pedidoExistente;
  }

  async obtenerItems(pedidoData) {
    const items = [];
    logger.info(`${JSON.stringify(pedidoData.items)}`);
    for (const item of pedidoData.items) {
      const producto = await this.repositorioProducto.findById(item.productoId); // await aquí
      if (!producto) {
        throw new ErrorNoEncontrado(item.productoId, "producto");
      }
      items.push(new ItemPedido(producto, item.cantidad, producto.precio));
    }

    return items;
  }
  async actualizarProductosPorCambioDeStock(items) {
    logger.info(`${JSON.stringify(items)}`);
    for (const item of items) {
      await this.repositorioProducto.updateProducto(item.producto);
    }
  }

  async actualizarStock(items, estado) {
    let itemsActualizados = items;
    if (estado === EstadoPedido.PENDIENTE) {
      itemsActualizados = reducirStocks(items);
      await this.actualizarProductosPorCambioDeStock(itemsActualizados);
      console.log("hola X3");
      console.log(`${JSON.stringify(items)}`);
    }
    if (
      estado === EstadoPedido.RECHAZADO ||
      estado === EstadoPedido.CANCELADO
    ) {
      itemsActualizados = aumentarStocks(items);
      await this.actualizarProductosPorCambioDeStock(itemsActualizados);
    }
    console.log("hola");
    return itemsActualizados;
  }
}
