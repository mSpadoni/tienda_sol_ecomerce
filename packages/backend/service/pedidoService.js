import Pedido from "../models/entities/Pedido.js";
import logger from "../logger/logger.js";
import {
  reducirStocks,
  aumentarStocks,
  obtenerDireccion,
  validarStock,
  obtenerEstado,
  monedaValida,
} from "./funcionesDelService.js";
import { EstadoPedido } from "../models/entities/EstadoPedido.js";
import ItemPedido from "../models/entities/ItemPedido.js";
import ErrorNoEncontrado from "../errors/errorNoEncontrado.js";
import { TipoUsuario } from "../models/entities/TipoUsuario.js";

export default class pedidoService {
  constructor(repositorioPedido, repositorioUsuario, repositorioProducto) {
    this.repositorioPedido = repositorioPedido;
    this.repositorioUsuario = repositorioUsuario;
    this.repositorioProducto = repositorioProducto;
  }

  async crear(pedidoData, usuarioId) {
    const usuario = await this.obtenerUsuario(usuarioId);

    let items = await this.obtenerItems(pedidoData);

    const moneda = monedaValida(pedidoData.moneda);

    validarStock(items);

    items = await this.actualizarStock(items, EstadoPedido.PENDIENTE);

    const direccionEntrega = obtenerDireccion(pedidoData);
    const nuevoPedido = new Pedido(usuario, items, moneda, direccionEntrega);
    const pedidoRespuesta = await this.repositorioPedido.save(nuevoPedido);
    return pedidoRespuesta;
  }

  async findPedidosByUsuariosId(idUsuario,funcionDeFiltrado) {
    logger.info(
      `Buscando pedidos del usuario con id:  ${idUsuario} en el servicio`,
    );

    const idDeMongo = await this.repositorioUsuario.obtnerId(idUsuario);
    if (!idDeMongo) {
      throw new ErrorNoEncontrado(idUsuario, "usuario");
    }

    const pedidos = await this.repositorioPedido.findByUsuarioId(idDeMongo,funcionDeFiltrado);

    if (pedidos.length === 0) {
      throw new ErrorNoEncontrado(
        idDeMongo._id,
        "Pedido que tenga un comprador o vendedor",
      );
    }
    return pedidos;
  }

  async actualizar(idUsuario, idPedido, pedidoData) {
    const pedidoExistente = await this.obtenerPedido(idPedido);

    const usuario = await this.obtenerUsuario(idUsuario);

    const estado = obtenerEstado(pedidoData.estado);

    pedidoExistente.actualizarEstado(estado, usuario, pedidoData.motivo);
    pedidoExistente.items = await this.actualizarStock(
      pedidoExistente.items,
      pedidoExistente.estado,
    );
    const pedidoActualizado =
      await this.repositorioPedido.save(pedidoExistente);

    return pedidoActualizado;
  }

  async obtenerUsuario(idUsuario) {
    const usuario = await this.repositorioUsuario.findById(idUsuario);
    if (!usuario) {
      throw new ErrorNoEncontrado(idUsuario, "usuario");
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
    for (const item of items) {
      await this.repositorioProducto.updateProducto(item.producto);
    }
  }

  async actualizarStock(items, estado) {
    let itemsActualizados = items;
    if (estado === EstadoPedido.CONFIRMADO) {
      itemsActualizados = reducirStocks(items);
      await this.actualizarProductosPorCambioDeStock(itemsActualizados);
    }
    if (
      estado === EstadoPedido.RECHAZADO ||
      estado === EstadoPedido.CANCELADO
    ) {
      itemsActualizados = aumentarStocks(items);
      await this.actualizarProductosPorCambioDeStock(itemsActualizados);
    }

    return itemsActualizados;
  }
}
