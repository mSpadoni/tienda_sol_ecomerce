import { EstadoPedido } from "../../../models/entities/EstadoPedido.js";
import {
  usuario1,
  usuario2,
  usuario4,
  item,
  item2,
  direccion,
} from "../../../ejemplos.js";
import SoloElCompradorPuedeCancelarUnPedido from "../../../errors/errorSoloElCompradorPuedeCancelarUnPedido.js";
import SoloElVendedorPuedeEnviarUnPedido from "../../../errors/errorSoloElVendedorPuedeEnviarUnPedido.js";
import NoSePuedeCancelarUnPedidoEnviado from "../../../errors/errorNoSePuedeCancelarUnPedidoEnviado.js";
import NoSePuedeEnviarUnPedidoCancelado from "../../../errors/errorNoSePuedeEnviarUnPedidoCancelado.js";
import Pedido from "../../../models/entities/Pedido.js";
import YaEstaEnEseEstado from "../../../errors/errorYaEstaEnEseEstado.js";
describe("test pedido", () => {
  const pedidoBase = () =>
    new Pedido(
      usuario2,
      [item, item2],
      "Peso Argentino",
      direccion,
      new Date(),
    );

  test("El total de un pedido es igual a la suma de los subtotales de sus items", () => {
    expect(pedidoBase().calcularTotal()).toBe(6000);
  });

  test("Cualquiera puede cambiar un pedido a rechazado", () => {
    const pedido = pedidoBase();
    pedido.actualizarEstado(EstadoPedido.RECHAZADO, usuario1, "");
    expect(pedido.estado === EstadoPedido.RECHAZADO).toBe(true);
    expect(pedido.historialEstado).toContainEqual(
      expect.objectContaining({
        estado: EstadoPedido.RECHAZADO,
        usuario: usuario1,
        motivo: "",
        fecha: expect.any(Date),
        pedido: expect.any(Object),
      }),
    );
  });

  test("Un pedido no puede ser cancelado por alguien que no sea el comprador", () => {
    const pedido = pedidoBase();
    expect(() =>
      pedido.actualizarEstado(EstadoPedido.CANCELADO, usuario4, ""),
    ).toThrow(SoloElCompradorPuedeCancelarUnPedido);

    expect(pedido.estado === EstadoPedido.CANCELADO).toBe(false);
    expect(pedido.historialEstado).not.toContainEqual(
      expect.objectContaining({
        estado: EstadoPedido.CANCELADO,
        usuario: usuario1,
        motivo: "",
        fecha: expect.any(Date),
        pedido: expect.any(Object),
      }),
    );
  });

  test("Un pedido no puede ser enviado por alguien que no sea el vendedor", () => {
    const pedido = pedidoBase();
    expect(() =>
      pedido.actualizarEstado(EstadoPedido.ENVIADO, usuario1, ""),
    ).toThrow(SoloElVendedorPuedeEnviarUnPedido);

    expect(pedido.estado === EstadoPedido.ENVIADO).toBe(false);
    expect(pedido.historialEstado).not.toContainEqual(
      expect.objectContaining({
        estado: EstadoPedido.ENVIADO,
        usuario: usuario1,
        motivo: "",
        fecha: expect.any(Date),
        pedido: expect.any(Object),
      }),
    );
  });

  test("Un pedido no se puede cancelar despues de ser enviado", () => {
    const pedido = pedidoBase();
    pedido.actualizarEstado(EstadoPedido.ENVIADO, usuario4, "");
    expect(() =>
      pedido.actualizarEstado(EstadoPedido.CANCELADO, usuario2, ""),
    ).toThrow(NoSePuedeCancelarUnPedidoEnviado);

    expect(pedido.estado === EstadoPedido.CANCELADO).toBe(false);
    expect(pedido.historialEstado).not.toContainEqual(
      expect.objectContaining({
        estado: EstadoPedido.CANCELADO,
        usuario: usuario2,
        motivo: "",
        fecha: expect.any(Date),
        pedido: expect.any(Object),
      }),
    );
  });

  test("Un pedido no se puede enviar despues de ser cancelado", () => {
    const pedido = pedidoBase();
    pedido.actualizarEstado(EstadoPedido.CANCELADO, usuario2, "");
    expect(() =>
      pedido.actualizarEstado(EstadoPedido.ENVIADO, usuario4, ""),
    ).toThrow(NoSePuedeEnviarUnPedidoCancelado);

    expect(pedido.estado === EstadoPedido.ENVIADO).toBe(false);
    expect(pedido.historialEstado).not.toContainEqual(
      expect.objectContaining({
        estado: EstadoPedido.ENVIADO,
        usuario: usuario4,
        motivo: "",
        fecha: expect.any(Date),
        pedido: expect.any(Object),
      }),
    );
  });

  test("Solo el comprador puede cancelar un pedido", () => {
    const pedido = pedidoBase();
    pedido.actualizarEstado(EstadoPedido.CANCELADO, usuario2, "");
    expect(pedido.estado === EstadoPedido.CANCELADO).toBe(true);
    expect(pedido.historialEstado).toContainEqual(
      expect.objectContaining({
        estado: EstadoPedido.CANCELADO,
        usuario: usuario2,
        motivo: "",
        fecha: expect.any(Date),
        pedido: expect.any(Object),
      }),
    );
  });

  test("Solo el vendedor puede enviar un pedido", () => {
    const pedido = pedidoBase();
    pedido.actualizarEstado(EstadoPedido.ENVIADO, usuario4, "");
    expect(pedido.estado === EstadoPedido.ENVIADO).toBe(true);
    expect(pedido.historialEstado).toContainEqual(
      expect.objectContaining({
        estado: EstadoPedido.ENVIADO,
        usuario: usuario4,
        motivo: "",
        fecha: expect.any(Date),
        pedido: expect.any(Object),
      }),
    );
  });
});
