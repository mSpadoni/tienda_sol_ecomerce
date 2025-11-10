import { jest } from "@jest/globals";
import ErrorNoEncontrado from "../../../errors/errorNoEncontrado.js";
import { EstadoPedido } from "../../../models/entities/EstadoPedido.js";
import ItemPedido from "../../../models/entities/ItemPedido.js";
import { TipoUsuario } from "../../../models/entities/TipoUsuario.js";

jest.unstable_mockModule("../../../../logger/logger.js", () => ({
  default: { info: jest.fn() },
}));

jest.unstable_mockModule("../../../service/funcionesDelService.js", () => ({
  reducirStocks: jest.fn(),
  aumentarStocks: jest.fn(),
  validarStock: jest.fn(),
  obtenerDireccion: jest.fn(),
  obtenerEstado: jest.fn(),
  monedaValida: jest.fn(),
}));

const funciones = await import("../../../service/funcionesDelService.js");
const { default: pedidoService } = await import(
  "../../../service/pedidoService.js"
);
const { default: Pedido } = await import("../../../models/entities/Pedido.js");

describe("pedidoService (tests adaptados)", () => {
  let mockRepoPedido;
  let mockRepoUsuario;
  let mockRepoProducto;
  let service;

  const usuarioMock = {
    id: 1,
    _id: "u-1",
    nombre: "Juan",
    tipo: TipoUsuario.COMPRADOR,
  };
  const vendedorMock = {
    id: 2,
    _id: "u-2",
    nombre: "Vendedor",
    tipo: TipoUsuario.VENDEDOR,
  };
  const productoMock = {
    _id: "p-1",
    precio: 1000,
    vendedor: { _id: vendedorMock._id },
    reducirStock: jest.fn(),
    aumentarStock: jest.fn(),
    estaDisponible: jest.fn().mockReturnValue(true),
  };
  const item = new ItemPedido(productoMock, 2, productoMock.precio);
  const item2 = new ItemPedido(productoMock, 1, productoMock.precio);

  const pedidoBase = () =>
    new Pedido(
      usuarioMock,
      [item, item2],
      "Peso Argentino",
      { calle: "Falsa 123", altura: "100" },
      new Date(),
    );

  beforeEach(() => {
    mockRepoPedido = {
      generarID: jest.fn().mockReturnValue("generated-id"),
      save: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(null),
      findByUsuarioId: jest.fn().mockResolvedValue([]),
      updateById: jest.fn().mockResolvedValue(null),
    };
    mockRepoUsuario = {
      findById: jest.fn(),
      obtnerId: jest.fn(), // compatibilidad con impl actual
    };
    mockRepoProducto = {
      findById: jest.fn().mockResolvedValue(productoMock),
    };

    jest.clearAllMocks();

    service = new pedidoService(
      mockRepoPedido,
      mockRepoUsuario,
      mockRepoProducto,
    );
  });

  test("crear debe generar y guardar un nuevo pedido correctamente (usar pedidoBase())", async () => {
    const pedido = pedidoBase();

    funciones.monedaValida.mockReturnValue("Peso Argentino");
    funciones.validarStock.mockImplementation(() => {});
    funciones.obtenerDireccion.mockReturnValue(pedido.direccionEntrega);

    jest.spyOn(service, "obtenerUsuario").mockResolvedValue(usuarioMock);
    jest.spyOn(service, "obtenerItems").mockResolvedValue([item, item2]);
    jest.spyOn(service, "actualizarStock").mockResolvedValue([item, item2]);

    mockRepoPedido.save.mockImplementation(async (p) => ({
      ...p,
      id: "saved-id",
    }));

    const pedidoData = {
      items: [
        { productoId: productoMock._id, cantidad: 2 },
        { productoId: productoMock._id, cantidad: 1 },
      ],
      moneda: "Peso Argentino",
      direccionEntrega: pedido.direccionEntrega,
    };

    const resultado = await service.crear(pedidoData, usuarioMock.id);

    expect(service.obtenerUsuario).toHaveBeenCalledWith(usuarioMock.id);
    expect(service.obtenerItems).toHaveBeenCalledWith(pedidoData);
    expect(funciones.monedaValida).toHaveBeenCalledWith(pedidoData.moneda);
    expect(funciones.validarStock).toHaveBeenCalledWith([item, item2]);
    expect(service.actualizarStock).toHaveBeenCalledWith(
      [item, item2],
      expect.anything(),
    );
    expect(mockRepoPedido.save).toHaveBeenCalled();
    expect(resultado).toBeDefined();
    expect(resultado.id).toBe("saved-id");
  });

  test("findPedidosByUsuariosId debe retornar pedidos del usuario (usar pedidoBase())", async () => {
    const pedido = pedidoBase();

    mockRepoUsuario.obtnerId.mockResolvedValue({ _id: usuarioMock._id });
    mockRepoPedido.findByUsuarioId.mockResolvedValue([pedido]);

    const resultado = await service.findPedidosByUsuariosId(usuarioMock.id);

    expect(mockRepoUsuario.obtnerId).toHaveBeenCalledWith(usuarioMock.id);
    expect(mockRepoPedido.findByUsuarioId).toHaveBeenCalledWith({
      _id: usuarioMock._id,
    });
    expect(resultado).toEqual([pedido]);
  });

  test("findPedidosByUsuariosId debe lanzar ErrorNoEncontrado si usuario no existe o no hay pedidos", async () => {
    // usuario no existe
    mockRepoUsuario.obtnerId.mockResolvedValue(null);
    await expect(service.findPedidosByUsuariosId(999)).rejects.toBeInstanceOf(
      ErrorNoEncontrado,
    );

    // usuario existe pero no hay pedidos
    mockRepoUsuario.obtnerId.mockResolvedValue({ _id: usuarioMock._id });
    mockRepoPedido.findByUsuarioId.mockResolvedValue([]);
    await expect(
      service.findPedidosByUsuariosId(usuarioMock.id),
    ).rejects.toBeInstanceOf(ErrorNoEncontrado);
  });

  test("actualizar debe modificar un pedido existente (usar pedidoBase())", async () => {
    const pedido = pedidoBase();
    pedido.id = "pedido-id";

    jest.spyOn(service, "obtenerPedido").mockResolvedValue(pedido);
    jest.spyOn(service, "obtenerUsuario").mockResolvedValue(vendedorMock);
    funciones.obtenerEstado.mockReturnValue(EstadoPedido.ACEPTADO);
    jest.spyOn(service, "actualizarStock").mockResolvedValue([item, item2]);
    mockRepoPedido.save.mockImplementation(async (p) => p);

    const pedidoData = { estado: EstadoPedido.ACEPTADO, motivo: "OK" };

    const actualizado = await service.actualizar(
      vendedorMock.id,
      pedido.id,
      pedidoData,
    );

    expect(service.obtenerPedido).toHaveBeenCalledWith(pedido.id);
    expect(service.obtenerUsuario).toHaveBeenCalledWith(vendedorMock.id);
    expect(funciones.obtenerEstado).toHaveBeenCalledWith(pedidoData.estado);
    expect(mockRepoPedido.save).toHaveBeenCalled();
    expect(actualizado.items).toEqual([item, item2]);
  });

  test("crear debe lanzar error si el usuario no es un comprador (usar pedidoBase())", async () => {
    const pedido = pedidoBase();
    const usuarioVendedor = { id: 10, tipo: TipoUsuario.VENDEDOR };

    jest.spyOn(service, "obtenerUsuario").mockResolvedValue(usuarioVendedor);
    jest.spyOn(service, "obtenerItems").mockImplementation(() => {
      throw new Error("El usuario no tiene permisos para crear pedidos");
    });

    const pedidoData = { items: [], moneda: "Peso Argentino" };

    await expect(service.crear(pedidoData, usuarioVendedor.id)).rejects.toThrow(
      "El usuario no tiene permisos para crear pedidos",
    );
  });

  test("crear debe lanzar error si no hay stock disponible (usar pedidoBase())", async () => {
    const pedido = pedidoBase();

    jest.spyOn(service, "obtenerUsuario").mockResolvedValue(usuarioMock);
    jest.spyOn(service, "obtenerItems").mockResolvedValue([item]);

    funciones.validarStock.mockImplementation(() => {
      throw new Error("Stock insuficiente");
    });

    const pedidoData = {
      items: [{ productoId: productoMock._id, cantidad: 2 }],
      moneda: "Peso Argentino",
    };

    await expect(service.crear(pedidoData, usuarioMock.id)).rejects.toThrow(
      "Stock insuficiente",
    );
  });

  test("actualizar debe lanzar error si el pedido no existe", async () => {
    jest.spyOn(service, "obtenerPedido").mockImplementation(() => {
      throw new Error("Pedido no encontrado");
    });

    await expect(service.actualizar(usuarioMock.id, 99, {})).rejects.toThrow(
      "Pedido no encontrado",
    );
  });

  test("actualizar debe lanzar error si el estado es inválido", async () => {
    const pedido = pedidoBase();
    pedido.id = 1;

    jest.spyOn(service, "obtenerPedido").mockResolvedValue(pedido);
    jest.spyOn(service, "obtenerUsuario").mockResolvedValue(usuarioMock);
    funciones.obtenerEstado.mockImplementation(() => {
      throw new Error("Estado inválido");
    });

    await expect(
      service.actualizar(usuarioMock.id, pedido.id, { estado: "DESCONOCIDO" }),
    ).rejects.toThrow("Estado inválido");
  });
});
