export const Moneda = Object.freeze({
  PESO_ARG: "Peso Argentino",
  DOLAR_USA: "Dolar USA",
  REAL: "Real",
});



export function monedaValida(value) {
  return Object.values(Moneda).includes(value);
}
