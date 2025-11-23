import "./notificacion.css";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import notis from "../../components/mockData/Notificaciones.js"; // Ya no lo usás
import NotificacionesDesplegable from "./notificacionesDesplegable.jsx";
import { Alert } from "@mui/material";
import { getNotificaciones,marcarNotificacionComoLeida } from "../../services/notificacionesServiceFront.js"; // Ajustá el path si es necesario
import { status } from "nprogress";
import { useNavigate } from "react-router-dom";

export default function ListaNotificaciones({}) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [estadoABuscar, setEstadoABuscar] = useState(null);
  const [estado_lectura, setEstadoL] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje,setMensaje]=useState("Usted no ha recibido notificaciones todavía...");
  const navigate = useNavigate();

  // Traer notificaciones del backend
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("kc_token");
    getNotificaciones({}, token)
      .then((data) => {
        setNotificaciones(data);
        setLoading(false);
        console.log(data)
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
      console.log(notificaciones)
  }, []);

  useEffect(()=>(!(typeof estadoABuscar === "boolean"))?navigate("/notificaciones"):navigate(`/notificaciones?leida=${estadoABuscar}`),
  [estadoABuscar,navigate]);

  const funcionDeFiltrado = (eleccion) => {
    const token = localStorage.getItem("kc_token");
    if (eleccion === "") {
      // Volver a cargar todas las notificaciones
      
      getNotificaciones({}, token)
        .then((data) => {setNotificaciones(data)})
        .catch((e) => setError(e));
    } else {
      getNotificaciones({leida:eleccion}, token)
        .then((data) => {setNotificaciones(data)})
        .catch((e) => setError(e));
    }
  };

  const cambiarLeida = (idnotificacion, estado) => {
  const token = localStorage.getItem("kc_token");

  marcarNotificacionComoLeida(idnotificacion, token, estado)
    .then(() => {
      if (typeof estadoABuscar === "boolean") {
        return getNotificaciones({ leida: estadoABuscar }, token);
      } else {
        return getNotificaciones({}, token);
      }
    })
    .then((data) => {
      setNotificaciones(data);
      setLoading(false);
    })
    .catch((e) => {
      setError(e);
      setLoading(false);
    });
};

  if (loading) {
    return <div>Cargando notificaciones...</div>;
  }

  if (error) {
    return (
      <Alert severity="error" className="alert-error">
        {error.message}
      </Alert>
    );
  }

  if (notificaciones.length === 0) {
    return (<>
        <NotificacionesDesplegable
            token={localStorage.getItem("kc_token")}
            setEstadoABuscar={setEstadoABuscar}
            funcionDeFiltrado={funcionDeFiltrado}
            estado_lectura={estado_lectura}
            setEstadoLectura={setEstadoL}
            setMensaje={setMensaje}
          />
        <div className="Notificaciones_mensaje">{mensaje}</div>
      </>
    );
  }

  return (
    <div className="notificaciones-wrapper">
      <div className="notificaciones-container">
        <div className="filtro-estado">
          <NotificacionesDesplegable
            token={localStorage.getItem("kc_token")}
            setEstadoABuscar={setEstadoABuscar}
            funcionDeFiltrado={funcionDeFiltrado}
            estado_lectura={estado_lectura}
            setEstadoLectura={setEstadoL}
            setMensaje={setMensaje}
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
                    onClick={() =>{
                      cambiarLeida(
                        notificacion._id,
                        accionesDeLectura(notificacion.leida).estado,
                      )
                   
                  }
                      
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
    </div>
  );
}


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
