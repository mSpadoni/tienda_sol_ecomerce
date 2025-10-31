// CurrencyProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const CurrencyContext = createContext();
export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("ARS"); // moneda base global

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency}}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
