import FactoryNotification from "../../../models/entities/FactoryNotificacion.js";
import { jsonPedidosEjemplo1, noti1, noti2, noti3,noti4,noti5 } from "../../../ejemplos.js";
import { EstadoPedido } from "../../../models/entities/EstadoPedido.js";

describe("test factoryNotification", () => {
  test("Si no hay una instancia previa se crea una nueva", () => {
    const factory = new FactoryNotification();
    expect(factory).toBeInstanceOf(FactoryNotification);
  });
  test("si ya existe una instancia devuelve esa misma instancia", () => {
    const factoryOriginal = new FactoryNotification();
    const factoryNuevo = new FactoryNotification();
    expect(factoryNuevo).toBe(factoryOriginal);
  });
  test(`Existe una notificacion para un pedido confirmado, y me da el siguiente mensaje: ${noti1.mensaje}`, () => {
    const factory = new FactoryNotification();
    expect(factory.crearSegunPedido(jsonPedidosEjemplo1)).toEqual({
      ...noti1,
      fechaAlta: expect.any(Date),
    });
  });
  test(`Existe una notificacion para un pedido enviado, y me da el siguiente mensaje: ${noti3.mensaje}`, () => {
    jsonPedidosEjemplo1.estado = EstadoPedido.ENVIADO;
    const factory = new FactoryNotification();
    expect(factory.crearSegunPedido(jsonPedidosEjemplo1)).toEqual({
      ...noti3,
      fechaAlta: expect.any(Date),
    });
  });
  test(`Existe una notificacion para un pedido cancelado , y me da el siguiente mensaje: ${noti2.mensaje}`, () => {
    jsonPedidosEjemplo1.estado = EstadoPedido.CANCELADO;
    const factory = new FactoryNotification();
    expect(factory.crearSegunPedido(jsonPedidosEjemplo1)).toEqual({
      ...noti2,
      fechaAlta: expect.any(Date),
    });
  });
  test(`Existe una notificacion para un pedido cancelado , y me da el siguiente mensaje: ${noti4.mensaje}`, () => {
    jsonPedidosEjemplo1.estado = EstadoPedido.RECHAZADO;
    const factory = new FactoryNotification();
    expect(factory.crearSegunPedido(jsonPedidosEjemplo1)).toEqual({
      ...noti4,
      fechaAlta: expect.any(Date),
    });
  });
  test(`Existe una notificacion para un pedido cancelado , y me da el siguiente mensaje: ${noti5.mensaje}`, () => {
    jsonPedidosEjemplo1.estado = EstadoPedido.FINALIZADO;
    const factory = new FactoryNotification();
   expect(factory.crearSegunPedido(jsonPedidosEjemplo1)).toEqual({
      ...noti5,
      fechaAlta: expect.any(Date),
    });
  });
});
