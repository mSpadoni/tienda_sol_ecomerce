import Producto from "../../../Dominio/Producto.js";
import { prodEjemplo1, prodEjemplo2, usuario4 } from "../../../ejemplos.js";

describe("Clase Producto", () => {
  test("constructor asigna correctamente las propiedades", () => {
    expect(prodEjemplo1.titulo).toBe("milanesa");
    expect(prodEjemplo1.descripcion).toBe("rica milanesa");
    expect(prodEjemplo1.precio).toBe(5000);
    expect(prodEjemplo1.stock).toBe(10);
    expect(prodEjemplo1.activo).toBe(true);
  });

  test("estaDisponible devuelve true si hay stock suficiente y está activo", () => {
    expect(prodEjemplo1.estaDisponible(5)).toBe(true);
  });

  test("estaDisponible devuelve false si no hay stock suficiente", () => {
    expect(prodEjemplo1.estaDisponible(20)).toBe(false);
  });

  test("estaDisponible devuelve false si el producto no está activo", () => {
    const prodInactivo = new Producto(
      99,
      usuario4,
      "Producto inactivo",
      "desc",
      ["test"],
      100,
      "Peso Argentino",
      5,
      [],
      false,
    );
    expect(prodInactivo.estaDisponible(1)).toBe(false);
  });

  test("reducirStock disminuye el stock", () => {
    const p = new Producto(
      3,
      usuario4,
      "p",
      "d",
      [],
      100,
      "Peso Argentino",
      10,
      [],
      true,
    );
    p.reducirStock(3);
    expect(p.stock).toBe(7);
  });

  test("aumentarStock incrementa el stock", () => {
    const p = new Producto(
      4,
      usuario4,
      "p",
      "d",
      [],
      100,
      "Peso Argentino",
      5,
      [],
      true,
    );
    p.aumentarStock(5);
    expect(p.stock).toBe(10);
  });

  test("getVendedor devuelve el vendedor asociado", () => {
    expect(prodEjemplo2.getVendedor()).toBe(usuario4);
  });
});
