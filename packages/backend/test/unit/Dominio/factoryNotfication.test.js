import FactoryNotification from "../../../Dominio/FactoryNotificacion.js";
import { jsonPedidosEjemplo1, noti1, noti2, noti3 } from "../../../ejemplos.js";
import { EstadoPedido } from "../../../Dominio/EstadoPedido.js";

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
  test(`Existe una notificacion para un pedido pendiente, y me da el siguiente mensaje: ${noti1.mensaje}`, () => {
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
  test("No existe una notificacion para un pedido aceptado", () => {
    jsonPedidosEjemplo1.estado = EstadoPedido.ACEPTADO;
    const factory = new FactoryNotification();
    expect(factory.crearSegunPedido(jsonPedidosEjemplo1)).toBe(null);
  });
  test("No existe una notificacion para un pedido rechazado", () => {
    jsonPedidosEjemplo1.estado = EstadoPedido.RECHAZADO;
    const factory = new FactoryNotification();
    expect(factory.crearSegunPedido(jsonPedidosEjemplo1)).toBe(null);
  });
  test("No existe una notificacion para un pedido finalizado", () => {
    jsonPedidosEjemplo1.estado = EstadoPedido.FINALIZADO;
    const factory = new FactoryNotification();
    expect(factory.crearSegunPedido(jsonPedidosEjemplo1)).toBe(null);
  });
});
