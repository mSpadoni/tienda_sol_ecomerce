import "./notificacionesDesplegable.css";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getNotificaciones, marcarNotificacionComoLeida } from "../../services/notificacionesServiceFront";

const pasajeAboolean = (valor) => {
  if (valor === "true") return true;
  if (valor === "false") return false;
  return valor;
};

const NotificacionesDesplegable = ({
  token,
  setEstadoABuscar,
  funcionDeFiltrado,
  estado_lectura,
  setEstadoLectura,
  setMensaje
}) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      setError(null);
      setLoading(true);
      try {
        const filtros = {};
        if (estado_lectura !== "") filtros.leida = pasajeAboolean(estado_lectura);

        const data = await getNotificaciones(filtros, token);
        setNotificaciones(Array.isArray(data) ? data : data?.notificaciones || []);
      } catch (err) {
        console.error("Error cargando notificaciones:", err);
        setError(err.message || "Error cargando notificaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchNotificaciones();
  }, [estado_lectura, token]);

  const handleChange = (e) => {
    const value = e.target.value;
    setEstadoLectura(value);
    const booleano = pasajeAboolean(value);
    booleano===""?setMensaje("Usted no ha recibido notificaciones todavía..."):setMensaje(`Usted no ha recibido notificaciones ${booleano?"leídas":"no leídas"} todavía...`);
    setEstadoABuscar(booleano);
    funcionDeFiltrado(booleano);
  };

  return (
    <div className="filtro-container">
      <div className="filtro-box">
        <h3 className="filtro-titulo">Filtrar por estado</h3>
        <div className="filtro-estado">
          <select value={estado_lectura} onChange={handleChange} className="filtro-select">
            <option value="">Todas</option>
            <option value="true">Leídas</option>
            <option value="false">No Leídas</option>
          </select>
        </div>
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

NotificacionesDesplegable.propTypes = {
  token: PropTypes.string,
  setEstadoABuscar: PropTypes.func.isRequired,
  funcionDeFiltrado: PropTypes.func.isRequired,
  estado_lectura: PropTypes.string.isRequired,
  setEstadoLectura: PropTypes.func.isRequired,
  setMensaje: PropTypes.func.isRequired,
};

export default NotificacionesDesplegable;
