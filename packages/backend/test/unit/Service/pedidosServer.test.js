import { jest } from "@jest/globals";
import ErrorNoEncontrado from "../../../errors/errorNoEncontrado.js";
import { EstadoPedido } from "../../../models/entities/EstadoPedido.js";
import ItemPedido from "../../../models/entities/ItemPedido.js";
import { TipoUsuario } from "../../../models/entities/TipoUsuario.js";


// 🔹 Mock logger
jest.unstable_mockModule("../../../../logger/logger.js", () => ({
  default: { info: jest.fn() },
}));

// 🔹 Mock funciones externas
jest.unstable_mockModule(
  "../../../service/funcionesDelService.js",
  () => ({
    reducirStocks: jest.fn(),
    aumentarStocks: jest.fn(),
    validarStock: jest.fn(),
    obtenerDireccion: jest.fn(),
    obtenerEstado: jest.fn(),
    monedaValida: jest.fn(),
  })
);

const funciones = await import("../../../service/funcionesDelService.js");
const { default: pedidoService } = await import("../../../service/pedidoService.js");
const { default: Pedido } = await import("../../../models/entities/Pedido.js");

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
      findByUsuariosId: jest.fn()
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

    funciones.validarStock.mockImplementation(() => {});
    funciones.monedaValida.mockResolvedValue(monedaMock);
    funciones.obtenerDireccion.mockResolvedValue(direccionMock);

    jest.spyOn(service, "obtenerUsuario").mockResolvedValue(usuarioMock);
    jest.spyOn(service, "obtenerItems").mockResolvedValue(itemsMock);
    jest.spyOn(service, "actualizarStock").mockResolvedValue(itemsMock);

    mockRepoPedido.save.mockImplementation((pedido) => pedido);
    const pedidoData = {
      usuario: usuarioMock.id,
      moneda: monedaMock,
      items: itemsMock,
      direccion: direccionMock,
    };

    const nuevoPedido = service.crear(pedidoData).then((nuevoPedido) => {
    expect(funciones.monedaValida).toHaveBeenCalledWith(monedaMock);
    expect(funciones.obtenerDireccion).toHaveBeenCalledWith(pedidoData);

    expect(service.obtenerUsuario).toHaveBeenCalledWith(
      usuarioMock.id
    );
    expect(funciones.validarStock).toHaveBeenCalledWith(itemsMock);
    expect(mockRepoPedido.save).toHaveBeenCalled();
    expect(nuevoPedido).toBeInstanceOf(Pedido);
    expect(nuevoPedido.comprador).toEqual(usuarioMock);
  });
});
  // ---------- TEST findPedidosByUsuariosId ----------
  test("findPedidosByUsuariosId debe retornar pedidos del usuario", () => {
    const pedidosMock = [{ id: 1 }, { id: 2 }];

    service.repositorioPedido.findByUsuariosId.mockResolvedValue(pedidosMock);


    service.findPedidosByUsuariosId(99).then((result) => { ;

    expect(service.repositorioPedido.findByUsuariosId).toHaveBeenCalledWith(
      99
    );
    expect(result).toEqual(pedidosMock);
  });
  });
  // ---------- TEST actualizar ----------
  test("actualizar debe modificar un pedido existente", async () => {
    const pedidoExistente = {
      id: 10,
      items: [],
      actualizarEstado: jest.fn().mockImplementation(() => {})
    };

    const pedidoData = {
      estado: "PENDIENTE",
      usuario: { id: 1 },
      motivo: "corrección",
    };

    const usuarioMock = { id: 1, nombre: "Juan" };
    const estadoMock = EstadoPedido.PENDIENTE;
    const itemsActualizados = [{ id: 1 }];

    funciones.obtenerEstado.mockResolvedValue(estadoMock);

    jest.spyOn(service, "obtenerPedido").mockResolvedValue(pedidoExistente);
    jest.spyOn(service, "obtenerUsuario").mockResolvedValue(usuarioMock);
    jest.spyOn(service, "actualizarStock").mockResolvedValue(itemsActualizados);
    mockRepoPedido.save.mockImplementation((pedido) => pedido);

    await service.actualizar(10, pedidoData).then( (resultado) => {
    expect(service.obtenerPedido).toHaveBeenCalledWith(10);
    expect(pedidoExistente.actualizarEstado).toHaveBeenCalled();
    expect(mockRepoPedido.save).toHaveBeenCalledWith(pedidoExistente);
    expect(resultado.items).toEqual(itemsActualizados);
    })
  });
  // ---------- CAMINOS TRISTES ----------

  test("crear debe lanzar error si el usuario no es un comprador", () => {
    const usuarioVendedor = { id: 10, tipo: "VENDEDOR" };

    // Simulamos que la función auxiliar devuelve un usuario incorrecto
    jest.spyOn(service,"obtenerUsuario").mockResolvedValue(usuarioVendedor);

    const pedidoData = { usuario: usuarioVendedor, moneda: "Peso Argentino" };

    // Suponemos que validarStock no llega a llamarse porque hay un error antes
    jest.spyOn(service,"obtenerItems").mockImplementation(() => {
      throw new Error("El usuario no tiene permisos para crear pedidos");
    });

    expect(() => service.crear(pedidoData)).rejects.toThrow(
      "El usuario no tiene permisos para crear pedidos",
    );
  });

  test("crear debe lanzar error si no hay stock disponible", () => {
    const usuarioMock = { id: 1, tipo: TipoUsuario.COMPRADOR };
    const itemsMock = [{ id: 1, nombre: "milanesa", stock: 0 }];

    jest.spyOn(service,"obtenerItems").mockResolvedValue(itemsMock);
    jest.spyOn(service,"obtenerUsuario").mockResolvedValue(usuarioMock);

    funciones.validarStock.mockImplementation(() => {
      throw new FaltaStock();
    });

    const pedidoData = { usuario: usuarioMock, items: itemsMock };

    expect(() => service.crear(pedidoData)).rejects.toThrow("Stock insuficiente");
  });

  test("findPedidosByUsuariosId debe devolver lista vacía si el usuario no tiene pedidos", () => {
    mockRepoPedido.findByUsuariosId = jest.fn().mockResolvedValue([]);


    expect(service.findPedidosByUsuariosId(123)).rejects.toThrow(
      "No existe un Pedido que tenga un comprador con el id: 123"
    );
  });

  test("actualizar debe lanzar error si el pedido no existe", async () => {
    jest.spyOn(service,"obtenerPedido").mockImplementation(() => {
      throw new Error("Pedido no encontrado");
    });

    await expect(service.actualizar(99, {})).rejects.toThrow(
      "No existe un pedido con el id: 1",
    );
  });

  test("actualizar debe lanzar error si el estado es inválido", async () => {
    const pedidoExistente = { id: 1, items: [], actualizarEstado: jest.fn() };
    jest.spyOn(service,"obtenerPedido").mockResolvedValue(pedidoExistente);
    jest.spyOn(service,"obtenerUsuario").mockResolvedValue({ id: 1 });
    funciones.obtenerEstado.mockImplementation(() => {
      throw new ErrorEstadoNoValido("DESCONOCIDO");
    });

    await expect(
      service.actualizar(1, { estado: "DESCONOCIDO" }),
    ).rejects.toThrow(`Estado DESCONOCIDO no valido`);
  });
});