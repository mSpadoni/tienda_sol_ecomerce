import { obtenerMoneda, Moneda } from "../../../models/entities/Moneda";

describe("test moneda", () => {
  test("Se debe de poder obtener una moneda a partir de su nombre", () => {
    expect(obtenerMoneda("BRL")).toBe(Moneda.REAL);
  });
  test("No devuelve una moneda si el nombre no es valido", () => {
    expect(obtenerMoneda("")).toBe(undefined);
  });
});
