import logger from "../../logger/logger.js";
import {
  pedidoPatchSchema,
  pedidoSchema,
  idTransform,
} from "./validacionesZOD.js";
import { adaptarPedidoToJson, adaptarNotificacion } from "./adaptadoresJSON.js";

export default class ControllerPedidos {
  constructor(servicePedido, serviceNotificaciones) {
    this.servicePedido = servicePedido;
    this.serviceNotificaciones = serviceNotificaciones;
    logger.info({ servicePedido: this.servicePedido.constructor.name });
    logger.info({
      serviceNotificaciones: this.serviceNotificaciones.constructor.name,
    });
  }
  parse;

  async crear(req, res) {
    const resultBody = pedidoSchema.parse(req.body);
    const nuevoPedido = await this.servicePedido.crear(resultBody);

    logger.http(`Pedido creado`);
    const notificacion =
      this.serviceNotificaciones.crearNotificacion(nuevoPedido);

    logger.http(`Notificacion creada: ${JSON.stringify(notificacion)}`);

    const JSONresponse = {
      pedido: adaptarPedidoToJson(nuevoPedido),
      notificacion: adaptarNotificacion(notificacion),
    };

    res.status(201).json(JSONresponse);
  }

  async findPedidosByID(req, res) {
    logger.info(
      `Buscando pedidos del usuario con id: ${req.params.id} en el controlador`,
    );

    const resultId = idTransform.parse(req.params.id);

    logger.info(`Id del usuario valido: ${resultId}`);

    const pedidos = await this.servicePedido.findPedidosByUsuariosId(resultId);

    logger.http(
      `Pedidos del usuario con id: ${resultId} encontrados: ${JSON.stringify(pedidos)}`,
    );

    const pedidosAPTJ = pedidos.map((pedido) => adaptarPedidoToJson(pedido));

    res.status(200).json(pedidosAPTJ);
  }

  async actualizar(req, res) {
    logger.info("actualizando pedido");

    const pedidoID = idTransform.parse(req.params.id);

    const resultBody = pedidoPatchSchema.parse(req.body);

    logger.info("Datos validados, actualizando pedido");

    const pedidosActualizados = await this.servicePedido.actualizar(
      pedidoID,
      resultBody,
    );

    logger.info("Pedido actualizado");

    const notificacion =
      this.serviceNotificaciones.crearNotificacion(pedidosActualizados);

    logger.info("Notificacion creada");
    const JSONresponse = {
      pedido: adaptarPedidoToJson(pedidosActualizados),
      notificacion: adaptarNotificacion(notificacion),
    };

    logger.http(`Notificacion creada: ${JSON.stringify(JSONresponse)}`);
    res.status(200).json(JSONresponse);
  }
}
