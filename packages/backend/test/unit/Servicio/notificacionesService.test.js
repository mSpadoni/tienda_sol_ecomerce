import { jest } from "@jest/globals";
import NotificacionesService from "../../../service/notificacionesService.js";

function makeNotificacion(override = {}) {
  return {
    _id: "nid123",
    usuario: "uid123",
    mensaje: "algo",
    fechaAlta: new Date(),
    leida: false,
    fechaLeida: null,
    ...override,
  };
}

function makePedido(override = {}) {
  return {
    id: "p1",
    comprador: "u1",
    estado: "CREADO",
    detalles: {},
    ...override,
  };
}

describe("NotificacionesService", () => {
  let repoMock;
  let svc;

  beforeEach(() => {
    repoMock = {
      getNotificaciones: jest.fn(),
      marcarNotificacionComoLeida: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    svc = new NotificacionesService(repoMock);

    // reemplazamos la factory por un mock inspeccionable
    svc.factoryNotificacion = { crearSegunPedido: jest.fn() };
  });

  test("getNotificaciones llama al repo con los filtros y retorna el resultado", async () => {
    const lista = [makeNotificacion()];
    repoMock.getNotificaciones.mockResolvedValue(lista);

    const filtros = { leida: false };
    const res = await svc.getNotificaciones(filtros);

    expect(repoMock.getNotificaciones).toHaveBeenCalledWith(filtros);
    expect(res).toBe(lista);
  });

  test("marcarNotificacionComoLeida llama al repo y devuelve el actualizado", async () => {
    const updated = makeNotificacion({ _id: "nid123", leida: true, fechaLeida: new Date() });
    repoMock.marcarNotificacionComoLeida.mockResolvedValue(updated);

    const res = await svc.marcarNotificacionComoLeida("nid123");

    expect(repoMock.marcarNotificacionComoLeida).toHaveBeenCalledWith("nid123");
    expect(res).toBe(updated);
  });

  test("getNotificacionById retorna la notificacion cuando existe", async () => {
    const n = makeNotificacion({ _id: "nidX" });
    repoMock.findById.mockResolvedValue(n);

    const res = await svc.getNotificacionById("nidX");

    expect(repoMock.findById).toHaveBeenCalledWith("nidX");
    expect(res).toBe(n);
  });

  test("crearNotificacion usa la factory y guarda la notificacion en repo", async () => {
    const pedido = makePedido();
    const noti = makeNotificacion({ mensaje: "creada" });

    svc.factoryNotificacion.crearSegunPedido.mockReturnValue(noti);
    repoMock.save.mockResolvedValue(noti);

    const res = await svc.crearNotificacion(pedido);

    expect(svc.factoryNotificacion.crearSegunPedido).toHaveBeenCalledWith(pedido);
    expect(repoMock.save).toHaveBeenCalledWith(noti);
    expect(res).toBe(noti);
  });

  test("crearNotificacion propaga el error si repo.save falla", async () => {
    const pedido = makePedido();
    const noti = makeNotificacion();
    svc.factoryNotificacion.crearSegunPedido.mockReturnValue(noti);
    repoMock.save.mockRejectedValue(new Error("DB fail"));

    await expect(svc.crearNotificacion(pedido)).rejects.toThrow("DB fail");

    expect(svc.factoryNotificacion.crearSegunPedido).toHaveBeenCalledWith(pedido);
    expect(repoMock.save).toHaveBeenCalledWith(noti);
  });
});