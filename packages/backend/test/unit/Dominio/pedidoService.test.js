import { jest } from "@jest/globals";
import { TipoUsuario } from "../../../Dominio/TipoUsuario.js";

// 🔹 Mock del logger (tiene que hacerse ANTES del import del módulo que lo usa)
jest.unstable_mockModule("../../../../logger/logger.js", () => ({
  default: { info: jest.fn() },
}));

// 🔹 Mock de las funciones auxiliares
jest.unstable_mockModule("../../../service/funcionesDelService.js", () => ({
  obtenerUsuario: jest.fn(),
  obtenerItems: jest.fn(),
  validarStock: jest.fn(),
  actualizarStock: jest.fn(),
  obtenerMoneda: jest.fn(),
  obtenerDireccion: jest.fn(),
  obtenerPedidosPorUsuario: jest.fn(),
  obtenerPedido: jest.fn(),
  obtenerEstado: jest.fn(),
}));

// 🔹 Importamos lo mockeado
const funciones = await import("../../../service/funcionesDelService.js");
const { EstadoPedido } = await import("../../../Dominio/EstadoPedido.js");
const { default: Pedido } = await import("../../../Dominio/Pedido.js");

// 🔹 Importamos el servicio (DESPUÉS de los mocks)
const { default: pedidoService } = await import(
  "../../../service/pedidoService.js"
);

describe("pedidoService (modo ESM)", () => {
  let mockRepoPedido;
  let mockRepoUsuario;
  let mockRepoProducto;
  let service;

  beforeEach(() => {
    // Mocks de repositorios
    mockRepoPedido = {
      generarID: jest.fn().mockReturnValue(123),
      save: jest.fn(),
      updateById: jest.fn(),
    };
    mockRepoUsuario = {};
    mockRepoProducto = {};

    jest.clearAllMocks();

    service = new pedidoService(
      mockRepoPedido,
      mockRepoUsuario,
      mockRepoProducto,
    );
  });

  // ---------- TEST crear ----------
  test("crear debe generar y guardar un nuevo pedido correctamente", () => {
    const usuarioMock = { id: 1, nombre: "Juan", tipo: TipoUsuario.COMPRADOR };
    const itemsMock = [{ id: 1, nombre: "milanesa" }];
    const monedaMock = "Peso Argentino";
    const direccionMock = { calle: "Falsa 123" };

    funciones.obtenerUsuario.mockReturnValue(usuarioMock);
    funciones.obtenerItems.mockReturnValue(itemsMock);
    funciones.validarStock.mockImplementation(() => {});
    funciones.actualizarStock.mockReturnValue(itemsMock);
    funciones.obtenerMoneda.mockReturnValue(monedaMock);
    funciones.obtenerDireccion.mockReturnValue(direccionMock);

    const pedidoData = {
      usuario: usuarioMock.id,
      moneda: monedaMock,
      items: itemsMock,
      direccion: direccionMock,
    };

    const nuevoPedido = service.crear(pedidoData);

    expect(funciones.obtenerUsuario).toHaveBeenCalledWith(
      usuarioMock.id,
      mockRepoUsuario,
    );
    expect(funciones.validarStock).toHaveBeenCalledWith(itemsMock);
    expect(mockRepoPedido.save).toHaveBeenCalled();
    expect(nuevoPedido).toBeInstanceOf(Pedido);
    expect(nuevoPedido.comprador).toEqual(usuarioMock);
  });

  // ---------- TEST findPedidosByUsuariosId ----------
  test("findPedidosByUsuariosId debe retornar pedidos del usuario", () => {
    const pedidosMock = [{ id: 1 }, { id: 2 }];
    funciones.obtenerPedidosPorUsuario.mockReturnValue(pedidosMock);

    const result = service.findPedidosByUsuariosId(99);

    expect(funciones.obtenerPedidosPorUsuario).toHaveBeenCalledWith(
      99,
      mockRepoPedido,
    );
    expect(result).toEqual(pedidosMock);
  });

  // ---------- TEST actualizar ----------
  test("actualizar debe modificar un pedido existente", async () => {
    const pedidoExistente = {
      id: 10,
      items: [],
      actualizarEstado: jest.fn(),
    };

    const pedidoData = {
      estado: "PENDIENTE",
      usuario: { id: 1 },
      motivo: "corrección",
    };

    const usuarioMock = { id: 1, nombre: "Juan" };
    const estadoMock = EstadoPedido.PENDIENTE;
    const itemsActualizados = [{ id: 1 }];

    funciones.obtenerPedido.mockReturnValue(pedidoExistente);
    funciones.obtenerEstado.mockReturnValue(estadoMock);
    funciones.obtenerUsuario.mockReturnValue(usuarioMock);
    funciones.actualizarStock.mockReturnValue(itemsActualizados);

    const resultado = await service.actualizar(10, pedidoData);

    expect(funciones.obtenerPedido).toHaveBeenCalledWith(10, mockRepoPedido);
    expect(pedidoExistente.actualizarEstado).toHaveBeenCalledWith(
      estadoMock,
      usuarioMock,
      "corrección",
    );
    expect(mockRepoPedido.updateById).toHaveBeenCalledWith(10, pedidoExistente);
    expect(resultado.items).toEqual(itemsActualizados);
  });
  // ---------- CAMINOS TRISTES ----------

  test("crear debe lanzar error si el usuario no es un comprador", () => {
    const usuarioVendedor = { id: 10, tipo: "VENDEDOR" };

    // Simulamos que la función auxiliar devuelve un usuario incorrecto
    funciones.obtenerUsuario.mockReturnValue(usuarioVendedor);

    const pedidoData = { usuario: usuarioVendedor, moneda: "Peso Argentino" };

    // Suponemos que validarStock no llega a llamarse porque hay un error antes
    funciones.obtenerItems.mockImplementation(() => {
      throw new Error("El usuario no tiene permisos para crear pedidos");
    });

    expect(() => service.crear(pedidoData)).toThrow(
      "El usuario no tiene permisos para crear pedidos",
    );
  });

  test("crear debe lanzar error si no hay stock disponible", () => {
    const usuarioMock = { id: 1, tipo: "COMPRADOR" };
    const itemsMock = [{ id: 1, nombre: "milanesa", stock: 0 }];

    funciones.obtenerUsuario.mockReturnValue(usuarioMock);
    funciones.obtenerItems.mockReturnValue(itemsMock);
    funciones.validarStock.mockImplementation(() => {
      throw new Error("Stock insuficiente");
    });

    const pedidoData = { usuario: usuarioMock, items: itemsMock };

    expect(() => service.crear(pedidoData)).toThrow("Stock insuficiente");
  });

  test("findPedidosByUsuariosId debe devolver lista vacía si el usuario no tiene pedidos", () => {
    funciones.obtenerPedidosPorUsuario.mockReturnValue([]);

    const pedidos = service.findPedidosByUsuariosId(123);

    expect(pedidos).toEqual([]);
    expect(funciones.obtenerPedidosPorUsuario).toHaveBeenCalledWith(
      123,
      mockRepoPedido,
    );
  });

  test("actualizar debe lanzar error si el pedido no existe", async () => {
    funciones.obtenerPedido.mockImplementation(() => {
      throw new Error("Pedido no encontrado");
    });

    await expect(service.actualizar(99, {})).rejects.toThrow(
      "Pedido no encontrado",
    );
  });

  test("actualizar debe lanzar error si el estado es inválido", async () => {
    const pedidoExistente = { id: 1, items: [], actualizarEstado: jest.fn() };
    funciones.obtenerPedido.mockReturnValue(pedidoExistente);
    funciones.obtenerEstado.mockImplementation(() => {
      throw new Error("Estado inválido");
    });

    await expect(
      service.actualizar(1, { estado: "DESCONOCIDO" }),
    ).rejects.toThrow("Estado inválido");
  });
});
