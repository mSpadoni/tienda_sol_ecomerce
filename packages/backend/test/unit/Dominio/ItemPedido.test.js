import { item, prodEjemplo2 } from "../../../ejemplos.js";
import ItemPedido from "../../../models/entities/ItemPedido.js";
import CantNegativa from "../../../errors/errorCantNegativa.js";

describe("test item pedido", () => {
  test("Un item no  puede tener cant negativa", () => {
    expect(() => new ItemPedido(prodEjemplo2, -5, 100)).toThrow(CantNegativa);
  });
  test("Un item no  puede tener cant 0", () => {
    expect(() => new ItemPedido(prodEjemplo2, 0, 100)).toThrow(CantNegativa);
  });
  test("El subtotal de un item es el producto de su precio unitario y su cantidad", () => {
    const cantidad = item.subtotal();
    expect(cantidad).toBe(2000);
  });
});
