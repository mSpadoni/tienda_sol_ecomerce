export const Moneda = Object.freeze({
  PESO_ARG: {
    nombre: "ARS",
    simbolo: "$",
  },
  DOLAR_USA: {
    nombre: "USD",
    simbolo: "U$S",
  },
  REAL: {
    nombre: "BRL",
    simbolo: "R$",
  },
});

export function obtenerMoneda(value) {
  return Object.values(Moneda).find((moneda) => moneda.nombre === value);
}

