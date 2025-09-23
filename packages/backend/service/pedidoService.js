import Pedido from "../Dominio/Pedido.js";
import logger from "../../logger/logger.js";
import {
  obtenerEstado,
  obtenerPedidosPorUsuario,
  obtenerUsuario,
  obtenerPedido,
  obtenerItems,
  obtenerMoneda,
  obtenerDireccion,
  validarStock,
  actualizarProductosPorCambioDeStock,
  actualizarStock
} from "./funcionesDelService.js";
import { EstadoPedido } from "../Dominio/EstadoPedido.js";
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

  crear(pedidoData) {
    const usuario = obtenerUsuario(pedidoData.usuario, this.repositorioUsuario);
   let items = obtenerItems(pedidoData, this.repositorioProducto);

validarStock(items);

items = actualizarStock(items, this.repositorioProducto, EstadoPedido.PENDIENTE);
    const moneda = obtenerMoneda(pedidoData.moneda);

    const direccionEntrega = obtenerDireccion(pedidoData);
    const nuevoPedido = new Pedido(
      this.repositorioPedido.generarID(),
      usuario,
      items,
      moneda,
      direccionEntrega,
    );
    this.repositorioPedido.save(nuevoPedido);
    return nuevoPedido;
  }

  findPedidosByUsuariosId(idUsuario) {
    logger.info(
      `Buscando pedidos del usuario con id:  ${idUsuario} en el servicio`,
    );

    const pedidos = obtenerPedidosPorUsuario(idUsuario, this.repositorioPedido);

    return pedidos;
  }

  async actualizar(id, pedidoData) {
    const pedidoExistente = obtenerPedido(id, this.repositorioPedido);

    const estado = obtenerEstado(pedidoData.estado);

    const usuario = obtenerUsuario(pedidoData.usuario, this.repositorioUsuario);

    pedidoExistente.actualizarEstado(estado, usuario, pedidoData.motivo);
    pedidoExistente.items= actualizarStock( pedidoExistente.items, this.repositorioProducto, EstadoPedido.PENDIENTE);
    this.repositorioPedido.updateById(id, pedidoExistente);

    return pedidoExistente;
  }
}
