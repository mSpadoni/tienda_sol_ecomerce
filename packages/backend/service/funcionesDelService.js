import { monedaValida } from "../models/entities/Moneda.js";
import ItemPedido from "../models/entities/ItemPedido.js";
import findEstado, { EstadoPedido } from "../models/entities/EstadoPedido.js";
import DireccionEntrega from "../models/entities/DireccionEntrega.js";
import ErrorNoEncontrado from "../errors/errorNoEncontrado.js";
import ErrorMonedaNoPermitida from "../errors/errorMonedaNoPernitida.js";
import ErrorEstadoNoValido from "../errors/errorEstadoNoValido.js";
import FaltaStock from "../errors/errorFaltaDeStock.js";
import logger from "../../logger/logger.js";


export function obtenerUsuario(idUsuario, repositorioUsuario) {
  const usuario = repositorioUsuario.findById(idUsuario);
  if (!usuario) {
    throw new ErrorNoEncontrado(idUsuario, "ususario ");
  }
  return usuario;
}

export function obtenerEstado(estado) {
  const estadoRequerido = findEstado(estado);
  logger.info(`${JSON.stringify(estadoRequerido)}`);
  if (!estadoRequerido) {
    throw new ErrorEstadoNoValido(estado);
  }
  return estadoRequerido;
}

export function obtenerPedido(PedidoId, repositorioPedido) {
  const pedidoExistente = repositorioPedido.findById(PedidoId);
  if (!pedidoExistente) {
    throw new ErrorNoEncontrado(PedidoId, "pedido");
  }
  return pedidoExistente;
}

export async function obtenerPedidosPorUsuario(idUsuario, repositorioPedido) {
  const pedidos = await repositorioPedido.findByUsuariosId(idUsuario);
  logger.info(`${JSON.stringify(pedidos)}`);
  if (pedidos.length === 0) {
    throw new ErrorNoEncontrado(idUsuario, "Pedido que tenga un comprador");
  }
  return pedidos;
}

export function obtenerItems(pedidoData, repositorioProducto) {
  const items = [];
  pedidoData.items.forEach((item) => {
    const producto = repositorioProducto.findById(item.productoId);
    if (!producto) {
      throw new ErrorNoEncontrado(item.productoId, "producto ");
    }
    else {
      items.push(new ItemPedido(producto, item.cantidad, producto.precio));
    }
  });
  return items;
}

export function reducirStocks(items){
   logger.info(`${JSON.stringify(items)}`)
  items.forEach(item=>item.producto.reducirStock(item.cantidad))
  return items
}

export function aumentarStocks(items){
   logger.info(`${JSON.stringify(items)}`)
  items.forEach(item=>item.producto.reducirStock(item.cantidad))
  return items
}

export function actualizarProductosPorCambioDeStock(repositorioProducto,items){
  logger.info(`${JSON.stringify(items)}`)
  items.forEach(item=>repositorioProducto.updateProducto(item.producto))
}

export function actualizarStock(items,repositorioProducto,estado){
  let itemsActualizados=items
  if(estado===EstadoPedido.PENDIENTE){
    itemsActualizados=reducirStocks(items)
    actualizarProductosPorCambioDeStock(repositorioProducto,itemsActualizados)
  }
  if(estado===EstadoPedido.RECHAZADO || estado===EstadoPedido.CANCELADO){
    itemsActualizados=aumentarStocks(items)
    actualizarProductosPorCambioDeStock(repositorioProducto,itemsActualizados)
  }
  return itemsActualizados
}

export function validarStock(items){
  if(!items.every(item=>item.estaDisponible())){
    throw new FaltaStock()
  }
}

export function obtenerMoneda(monedaABuscar) {
  const moneda = monedaValida(monedaABuscar);
  if (!moneda) {
    throw new ErrorMonedaNoPermitida(monedaABuscar);
  }
  logger.info(`${JSON.stringify(moneda)}`);
  return moneda;
}

export function obtenerDireccion(pedido) {
  return new DireccionEntrega(
    pedido.direccionEntrega.calle,
    pedido.direccionEntrega.altura,
    pedido.direccionEntrega.piso,
    pedido.direccionEntrega.departamento,
    pedido.direccionEntrega.codigoPostal,
    pedido.direccionEntrega.ciudad,
    pedido.direccionEntrega.provincia,
    pedido.direccionEntrega.pais,
    pedido.direccionEntrega.lat,
    pedido.direccionEntrega.long,
  );
}
