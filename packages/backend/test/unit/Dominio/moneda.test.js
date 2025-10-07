
import { obtenerMoneda,  Moneda } from "../../../models/entities/Moneda";

describe("test mpneda", () => {
  test("Se debe de poder obtner una moneda a partir de su nombre", () => {
    expect(obtenerMoneda("Real")).toBe(Moneda.REAL)
  });
  
});