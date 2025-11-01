import "./notificacionesDesplegable.css";
import React, { useEffect, useState } from "react";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import PropTypes from "prop-types";
import notis from "../mockData/Notificaciones.js";

const notificacionesDesplegable = ({setEstadoABuscar,funcionDeFiltrado,estado_lectura,setEstadoLectura}) => {
 
  return (
        <div className="filtro-estado">
            <select value={estado_lectura} onChange={(e) => {setEstadoLectura(e.target.value);setEstadoABuscar(pasajeAboolean(e.target.value));funcionDeFiltrado(pasajeAboolean(e.target.value));}} className="currency-select">
            <option value="">Todas</option>
            <option value={true}>Leidas</option>
            <option value={false}>No Leidas</option>
          </select>
        </div>
  )
}

const pasajeAboolean = (valor) => {
    if (valor === "true") return true;
    if (valor === "false") return false;
    return valor;
}

export default notificacionesDesplegable;

notificacionesDesplegable.propTypes = {
    setEstadoABuscar: PropTypes.func.isRequired,
    funcionDeFiltrado: PropTypes.func.isRequired,
    estado_lectura: PropTypes.string.isRequired,
    setEstadoLectura: PropTypes.func.isRequired,
};  