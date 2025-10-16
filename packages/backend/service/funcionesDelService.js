import DireccionEntrega from "../models/entities/DireccionEntrega.js";
import FaltaStock from "../errors/errorFaltaDeStock.js";
import logger from "../../logger/logger.js";
import findEstado from "../models/entities/EstadoPedido.js";
import ErrorEstadoNoValido from "../errors/errorEstadoNoValido.js";
import { obtenerMoneda } from "../models/entities/Moneda.js";
import ErrorMonedaNoPermitida from "../errors/errorMonedaNoPernitida.js";

export function reducirStocks(items){
   logger.info(`${JSON.stringify(items)}`)
  items.forEach(item=>item.producto.reducirStock(item.cantidad))
  return items
}

export function aumentarStocks(items){
   logger.info(`${JSON.stringify(items)}`)
  items.forEach(item=>item.producto.aumentarStock(item.cantidad))
  return items
}

export function obtenerEstado(estado) {
  const estadoRequerido = findEstado(estado);
  logger.info(`${JSON.stringify(estadoRequerido)}`);
  if (!estadoRequerido) {
    throw new ErrorEstadoNoValido(estado);
  }
  return estadoRequerido;
}

export function monedaValida(monedaABuscar) {
  const moneda = obtenerMoneda(monedaABuscar);
  if (!moneda) {
    throw new ErrorMonedaNoPermitida(monedaABuscar);
  }
  logger.info(`${JSON.stringify(moneda)}`);
  return moneda;
}

export function validarStock(items) {
  if (!items.every((item) => item.estaDisponible())) {
    throw new FaltaStock();
  }
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
