export const Moneda = Object.freeze({
  PESO_ARG: {
    nombre: "Peso Argentino",
    simbolo: "$",
  },
  DOLAR_USA: {
    nombre: "Dólar",
    simbolo: "U$S",
  },
  REAL: {
    nombre: "Real",
    simbolo: "R$",
  },
});

export function monedaValida(value) {
  return Object.values(Moneda).find((moneda) => moneda.nombre === value);
}

export function obtenerSimbolo(nombreMoneda) {
  const monedaBuscada = Object.values(Moneda).find(
    (moneda) => moneda.nombre === nombreMoneda,
  );
  return monedaBuscada.simbolo;
}
