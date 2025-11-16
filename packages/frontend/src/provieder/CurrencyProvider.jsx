import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { obtenerTasa } from "../services/currenciesService.js";

export const CurrencyContext = createContext();
export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    "ARS", // default USD
  );

  useEffect(() => {
    localStorage.setItem("moneda", JSON.stringify(currency));
  }, [currency]);

  // const convert = async (precio, moneda) => {
  //   if (moneda === currency) return precio;
  //   console.log(moneda)
  //   const tasa = await obtenerTasa(moneda, currency);
  //   return precio * tasa;
  // };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
