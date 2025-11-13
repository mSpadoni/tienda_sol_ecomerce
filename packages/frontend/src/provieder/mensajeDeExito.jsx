import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
const MensajeContext = createContext();

export const useMensajes = () => useContext(MensajeContext);

export const MensajeProvider = ({ children }) => {
  const [mensajeExito, setMensajeExito] = useState("");

  const limpiarMensajes = () => setMensajeExito("");

  return (
    <MensajeContext.Provider
      value={{ mensajeExito, setMensajeExito, limpiarMensajes }}
    >
      {children}
    </MensajeContext.Provider>
  );
};

MensajeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
