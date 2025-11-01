import "./notificacion.css";
import React, { useEffect, useState } from "react";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import PropTypes from "prop-types";
import notis from "../mockData/Notificaciones.js";
import NotificacionesDesplegable from "./notificacionesDesplegable.jsx";

export default function ListaNotificaciones({ mensaje }) {
  const [openId, setOpenId] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [estadoABuscar, setEstadoABuscar] = useState(null); // null = mostrar todos
    const [estado_lectura, setEstadoL] = useState("");
  // Filtrar notificaciones según el estado
  const funcionDeFiltrado = (eleccion) => {
    if (eleccion==="") {
      setNotificaciones(notis);
    } else {
      setNotificaciones(notis.filter(n => n.leida === eleccion));
    }
  };

  useEffect(() => {
    setNotificaciones(notis);
  }, [mensaje]);

  const cambiarLeida = (idnotificacion, estado) => {
    setNotificaciones(prev =>
      prev.map(n =>
        n.id === idnotificacion ? { ...n, leida: estado } : n
      )
    );
    console.log(`Se actualizó la notificación con id: ${idnotificacion}`);
  };

  if (notificaciones.length === 0) {
    return (
      <div>
        <NotificacionesDesplegable
          setEstadoABuscar={setEstadoABuscar}
          funcionDeFiltrado={funcionDeFiltrado}
          estado_lectura={estado_lectura}
          setEstadoLectura = {setEstadoL}
        />
        <div style={{ padding: 20 }}>{mensaje}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div className="filtro-estado">
        <NotificacionesDesplegable
          setEstadoABuscar={setEstadoABuscar}
          funcionDeFiltrado={funcionDeFiltrado}
          estado_lectura={estado_lectura}
          setEstadoLectura = {setEstadoL}
        />
      </div>

      {notificaciones.map(notificacion => (
        <div
          key={notificacion.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            marginBottom: 10,
            padding: 10,
          }}
        >
          <div className="estado_lectura">
            {accionesDeLectura(notificacion.leida).textoItem}
          </div>
          <div className="pedido-info">
            <div className="pedido-info-visible">
              <h4>Notificación:</h4>
            
                <p>
                {notificacion.mensaje}</p>
          
            </div>

            <div className="pedido-cambiar-estado">
              <button
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
  );
}

ListaNotificaciones.propTypes = {
  mensaje: PropTypes.string,
};

// Función que devuelve textos y estado según si la notificación está leída
const accionesDeLectura = Object.freeze(Leida => {
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

