import findEstado, {EstadoPedido} from "../../../models/entities/EstadoPedido";



describe("test mpneda", () => {
  test("Se debe de poder obtner una moneda a partir de su nombre", () => {
    expect(findEstado("enviado")).toBe(EstadoPedido.ENVIADO)
  });
  test("No devuelve un estado si el nombre no es valido", () => {
    expect(findEstado("")).toBe(undefined)
  });
  
});