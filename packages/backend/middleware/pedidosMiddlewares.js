import ErrorPedidoNoEncontrado from "../errors/errorNoEncontrado.js";
import logger from "../../logger/logger.js";
import NoSePuedeCancelarUnPedidoEnviado from "../errors/errorNoSePuedeCancelarUnPedidoEnviado.js";
import NoSePuedeEnviarUnPedidoCancelado from "../errors/errorNoSePuedeEnviarUnPedidoCancelado.js";
import SoloElCompradorPuedeCancelarUnPedido from "../errors/errorSoloElCompradorPuedeCancelarUnPedido.js";
import SoloElVendedorPuedeEnviarUnPedido from "../errors/errorSoloElVendedorPuedeEnviarUnPedido.js";
import ErrorMonedaNoPermitida from "../errors/errorMonedaNoPernitida.js";
import ErrorEstadoNoValido from "../errors/errorEstadoNoValido.js";
import CantNegativa from "../errors/errorCantNegativa.js";
import NoEsTipoUsuarioCorecto from "../errors/errorNoEsTipoUsuarioCorrecto.js";
import FaltaStock from "../errors/errorFaltaDeStock.js";
import { ZodError } from "zod";
import YaEstaEnEseEstado from "../errors/errorYaEstaEnEseEstado.js";

export default function pedidosErrorHandler(err, _req, res, next) {
  if (err.constructor.name !== ZodError.name) {
    logger.error(err.message);
  }

  if (err.constructor.name === ErrorPedidoNoEncontrado.name) {
    res.status(404).json({ error: err.message });
    return;
  }
  if (esError400(err.constructor.name)) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err.constructor.name === FaltaStock.name) {
    res.status(409).json({ error: err.message });
    return;
  }

  next(err);
}

const errores400 = Object.freeze({
  NO_SE_PUEDE_CANCELAR_UN_PEDIDO_ENVIADO: NoSePuedeCancelarUnPedidoEnviado.name,
  NO_SE_PUEDE_ENVIAR_UN_PEDIDO_CANCELADO: NoSePuedeEnviarUnPedidoCancelado.name,
  SOLO_EL_COMPRADOR_PUEDE_CANCELAR_UN_PEDIDO:
    SoloElCompradorPuedeCancelarUnPedido.name,
  SOLO_EL_VENDEDOR_PUEDE_ENVIAR_UN_PEDIDO:
    SoloElVendedorPuedeEnviarUnPedido.name,
  ERROR_MONEDA_NO_PERMITIDA: ErrorMonedaNoPermitida.name,
  ERROR_ESTADO_NO_VALIDO: ErrorEstadoNoValido.name,
  CANT_NEGATIVA: CantNegativa.name,
  NO_ES_TIPO_USUARIO_CORRECTO: NoEsTipoUsuarioCorecto.name,
  YA_ESTA_EN_ESE_ESTADO: YaEstaEnEseEstado.name,
});

function esError400(errorAEvaluar) {
  return Object.values(errores400).some(
    (error400) => error400 === errorAEvaluar,
  );
}
