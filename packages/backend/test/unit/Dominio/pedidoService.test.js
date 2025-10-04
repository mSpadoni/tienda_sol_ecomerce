import { jest } from "@jest/globals";
import { TipoUsuario } from "../../../Dominio/TipoUsuario.js";

// 🔹 Mock del logger (tiene que hacerse ANTES del import del módulo que lo usa)
jest.unstable_mockModule("../../../../logger/logger.js", () => ({
  default: { info: jest.fn() },
}));

// 🔹 Mock de las funciones auxiliares
jest.unstable_mockModule(
  "../../../service/funcionesDelService.js",
  () => ({
    obtenerUsuario: jest.fn(),
    obtenerItems: jest.fn(),
    validarStock: jest.fn(),
    actualizarStock: jest.fn(),
    obtenerMoneda: jest.fn(),
    obtenerDireccion: jest.fn(),
    obtenerPedidosPorUsuario: jest.fn(),
    obtenerPedido: jest.fn(),
    obtenerEstado: jest.fn(),
  })
);

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
      mockRepoProducto
    );
  });

  // ---------- TEST crear ----------
  test("crear debe generar y guardar un nuevo pedido correctamente", () => {
    const usuarioMock = { id: 1, nombre: "Juan",tipo: TipoUsuario.COMPRADOR};
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
      mockRepoUsuario
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
      mockRepoPedido
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
      "corrección"
    );
    expect(mockRepoPedido.updateById).toHaveBeenCalledWith(10, pedidoExistente);
    expect(resultado.items).toEqual(itemsActualizados);
  });
});