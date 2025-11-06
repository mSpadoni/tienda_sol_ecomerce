import "./notificacionesDesplegable.css";
import React from "react";
import PropTypes from "prop-types";

const notificacionesDesplegable = ({ setEstadoABuscar, funcionDeFiltrado, estado_lectura, setEstadoLectura }) => {
  return (
    <div className="filtro-container">
      <div className="filtro-box">
        <h3 className="filtro-titulo">Filtrar por estado</h3>
        <div className="filtro-estado">
          <select
            value={estado_lectura}
            onChange={(e) => {
              setEstadoLectura(e.target.value);
              setEstadoABuscar(pasajeAboolean(e.target.value));
              funcionDeFiltrado(pasajeAboolean(e.target.value));
            }}
            className="filtro-select"
          >
            <option value="">Todas</option>
            <option value={true}>Leídas</option>
            <option value={false}>No Leídas</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const pasajeAboolean = (valor) => {
  if (valor === "true") return true;
  if (valor === "false") return false;
  return valor;
};

export default notificacionesDesplegable;

notificacionesDesplegable.propTypes = {
  setEstadoABuscar: PropTypes.func.isRequired,
  funcionDeFiltrado: PropTypes.func.isRequired,
  estado_lectura: PropTypes.string.isRequired,
  setEstadoLectura: PropTypes.func.isRequired,
};
