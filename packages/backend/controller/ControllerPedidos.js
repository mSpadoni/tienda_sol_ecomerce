import logger from "../logger/logger.js";
import {
  pedidoPatchSchema,
  pedidoSchema,
  objectIdSchema,
  validadIdkecloark,
} from "./validacionesZOD.js";
import { adaptarPedidoToJson, adaptarNotificacion } from "./adaptadoresJSON.js";

export default class ControllerPedidos {
  constructor(servicePedido, serviceNotificaciones) {
    this.servicePedido = servicePedido;
    this.serviceNotificaciones = serviceNotificaciones;
  }

  async crear(req, res) {
    const resultUsuario = validadIdkecloark.parse(req.user.sub);
    const resultBody = pedidoSchema.parse(req.body);
    const nuevoPedido = await this.servicePedido.crear(
      resultBody,
      resultUsuario,
    );

    logger.http(`Pedido creado`);
    logger.info(nuevoPedido)
    const notificacion =
      await this.serviceNotificaciones.crearNotificacion(nuevoPedido);
    logger.http(`Notificacion creada`);

    const JSONresponse = {
      pedido: adaptarPedidoToJson(nuevoPedido),
      notificacion: adaptarNotificacion(notificacion),
    };

    res.status(201).json(JSONresponse);
  }

  async findPedidosByID(req, res, funcionDeFiltrado) {
    const resultUsuario = validadIdkecloark.parse(req.user.sub);
    logger.info(
      `Buscando pedidos del usuario con id: ${resultUsuario} en el controlador`,
    );

    const pedidos =
      await this.servicePedido.findPedidosByUsuariosId(resultUsuario,funcionDeFiltrado);

    logger.info(`Pedidos encontrados`);

    const pedidosAPTJ = pedidos.map((pedido) => adaptarPedidoToJson(pedido));

    res.status(200).json(pedidosAPTJ);
  }

  async actualizar(req, res) {
    logger.info("actualizando pedido");
    const usuarioId = validadIdkecloark.parse(req.user.sub);
    const pedidoID = objectIdSchema.parse(req.params.id);

    const resultBody = pedidoPatchSchema.parse(req.body);

    logger.info("Datos validados, actualizando pedido");

    const pedidosActualizados = await this.servicePedido.actualizar(
      usuarioId,
      pedidoID,
      resultBody,
    );

    const notificacion =
      await this.serviceNotificaciones.crearNotificacion(pedidosActualizados);

    logger.info("Notificacion creada");
    const JSONresponse = {
      pedido: adaptarPedidoToJson(pedidosActualizados),
      notificacion: adaptarNotificacion(notificacion),
    };

    res.status(200).json(JSONresponse);
  }
}
