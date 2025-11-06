import "./notificacion.css";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import notis from "../../components/mockData/Notificaciones.js";
import NotificacionesDesplegable from "./notificacionesDesplegable.jsx";

export default function ListaNotificaciones({ mensaje }) {
  const [openId, setOpenId] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [estadoABuscar, setEstadoABuscar] = useState(null);
  const [estado_lectura, setEstadoL] = useState("");

  const funcionDeFiltrado = (eleccion) => {
    if (eleccion === "") {
      setNotificaciones(notis);
    } else {
      setNotificaciones(notis.filter((n) => n.leida === eleccion));
    }
  };

  useEffect(() => {
    setNotificaciones(notis);
  }, [mensaje]);

  const cambiarLeida = (idnotificacion, estado) => {
    setNotificaciones((prev) =>
      prev.map((n) =>
        n.id === idnotificacion ? { ...n, leida: estado } : n
      )
    );
  };

  if (notificaciones.length === 0) {
    return (
      <div className="notificaciones-container">
        <NotificacionesDesplegable
          setEstadoABuscar={setEstadoABuscar}
          funcionDeFiltrado={funcionDeFiltrado}
          estado_lectura={estado_lectura}
          setEstadoLectura={setEstadoL}
        />
        <div style={{ padding: 20 }}>{mensaje}</div>
      </div>
    );
  }

  return (
    <div className="notificaciones-container">
      <div className="filtro-estado">
        <NotificacionesDesplegable
          setEstadoABuscar={setEstadoABuscar}
          funcionDeFiltrado={funcionDeFiltrado}
          estado_lectura={estado_lectura}
          setEstadoLectura={setEstadoL}
        />
      </div>

      <div className="notificaciones-lista">
        {notificaciones.map((notificacion) => (
          <div
            key={notificacion.id}
            className={`notificacion-card ${
              notificacion.leida ? "leida" : "no-leida"
            }`}
          >
            <div
              className={`estado_lectura ${
                notificacion.leida ? "leida" : "no-leida"
              }`}
            >
              {accionesDeLectura(notificacion.leida).textoItem}
            </div>

            <div className="contenido-notificacion">
              <div className="mensaje">
                <h4>Notificación:</h4>
                <p>{notificacion.mensaje}</p>
              </div>

              <div className="acciones">
                <button
                  className={`btn-cambiar ${
                    notificacion.leida ? "rojo" : "verde"
                  }`}
                  onClick={() =>
                    cambiarLeida(
                      notificacion.id,
                      accionesDeLectura(notificacion.leida).estado
                    )
                  }
                >
                  {accionesDeLectura(notificacion.leida).textoBotonCambio}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ListaNotificaciones.propTypes = {
  mensaje: PropTypes.string,
};

const accionesDeLectura = Object.freeze((Leida) => {
  if (Leida) {
    return {
      textoBotonCambio: "Marcar como no leída",
      estado: false,
      textoItem: "Leída",
    };
  } else {
    return {
      textoBotonCambio: "Marcar como leída",
      estado: true,
      textoItem: "No leída",
    };
  }
});
