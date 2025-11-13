import { jest } from "@jest/globals";
import ProductosService from "../../../service/productosService.js";

function makeProductoRaw(override = {}) {
  return {
    _id: "abcd1234",
    vendedor: "vend1",
    titulo: "Remera",
    descripcion: "Remera prueba",
    categoria: "Ropa",
    precio: 1000,
    moneda: "ARS",
    stock: 10,
    fotos: [],
    activo: true,
    ventas: 5,
    ...override,
  };
}

describe("ProductosService - getProductos", () => {
  let repoMock;
  let svc;

  beforeEach(() => {
    repoMock = {
      findByPage: jest.fn(),
      contarTodos: jest.fn(),
    };
    svc = new ProductosService(repoMock);
  });

  test("convierte page/limit (strings) y llama a findByPage y contarTodos", async () => {
    const productos = [
      makeProductoRaw({ _id: "p1" }),
      makeProductoRaw({ _id: "p2" }),
    ];
    repoMock.findByPage.mockResolvedValue(productos);
    repoMock.contarTodos.mockResolvedValue(25);

    const filtros = { categoria: "Deportes" };
    const res = await svc.getProductos(
      filtros,
      "true",
      "2",
      "10",
      "precio",
      "asc",
    );

    expect(repoMock.findByPage).toHaveBeenCalledWith(
      filtros,
      "true",
      2,
      10,
      "precio",
      "asc",
    );
    expect(repoMock.contarTodos).toHaveBeenCalled();
    expect(res).toBeDefined();
  });

  test("mapea correctamente los productos a DTO (toDTO)", async () => {
    const raw = makeProductoRaw({ _id: "p1", titulo: "Remera Negra" });
    repoMock.findByPage.mockResolvedValue([raw]);
    repoMock.contarTodos.mockResolvedValue(1);

    const out = await svc.getProductos({}, undefined, 1, 10, "ventas", "desc");

    if (out && out.data) {
      expect(out.data[0]).toHaveProperty("titulo", "Remera Negra");
      expect(out.data[0]).toHaveProperty("precio", 1000);
      expect(out.data[0]).toHaveProperty("ventas", 5);
      expect(out.data[0].id || out.data[0]._id).toBeDefined();
    } else {
      expect(Array.isArray(out)).toBe(true);
      expect(out[0]).toHaveProperty("titulo", "Remera Negra");
    }
  });

  test("normaliza page < 1 a 1 y limita limit máximo a 100", async () => {
    repoMock.findByPage.mockResolvedValue([]);
    repoMock.contarTodos.mockResolvedValue(0);

    await svc.getProductos({}, undefined, "-5", "1000");

    expect(repoMock.findByPage).toHaveBeenCalledWith(
      expect.any(Object),
      undefined,
      1,
      100,
      expect.any(String),
      expect.any(String),
    );
  });
});
