import "./notificacion.css";
import React, { useEffect, useState } from "react";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import PropTypes from "prop-types";
import notis from "../mockData/Notificaciones.js";




export default function ListaNotificaciones({mensaje}) {
  const [openId, setOpenId] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [estadoABuscar, setEstadoABuscar] = useState("");
  const [estado_lectura, setEstado_lectura] = useState("");
    const funcionDeFiltrado=(notificaciones)=>{
    setNotificaciones(notificaciones.filter(notificacion=>notificacion.leida===estadoABuscar))
    }
    
 useEffect(() => {setNotificaciones(notis);
  }, [mensaje]);

  const cambiarLeida=(idnotificacion,estado)=>{
    // Lógica para cambiar el estado del pedido con idPedido
    console.log(`Se leyo la notificación con id: ${idnotificacion}`);
  }
  <div>
        <div className="filtro-estado">
          <select value={estado_lectura} onChange={(e) => {setEstadoABuscar(e.target.value);funcionDeFiltrado(notis);}} className="currency-select">
            <option value="">Todas</option>
            <option value="true">Leidas</option>
            <option value="false">No Leidas</option>
          </select>
        </div>
        <div style={{ padding: 20 }}>{mensaje}</div>;
        </div>; 

  if (notificaciones.length === 0) {
     <div>
        <div className="filtro-estado">
          <select value={estado_lectura} onChange={(e) => {setEstadoABuscar(e.target.value);funcionDeFiltrado(notis);}} className="currency-select">
            <option value="">Todas</option>
            <option value="true">Leidas</option>
            <option value="false">No Leidas</option>
          </select>
        </div>
        <div style={{ padding: 20 }}>{mensaje}</div>;
        </div>; 


  }

  return (
    <div style={{ padding: 20 }}>
        <div className="filtro-estado">
          <select value={estado_lectura} onChange={(e) => {setEstado_lectura(e);setEstadoABuscar(e.target.value);funcionDeFiltrado(notis);}} className="currency-select">
            <option value="">Todas</option>
            <option value="true">Leidas</option>
            <option value="false">No Leidas</option>
          </select>
        </div>
      {notificaciones.map((notificacion) => (
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
              <h4>Notificacion:</h4>
              <ul>
                {notificacion.mensaje}
              </ul>
            </div>

            <div className="pedido-cambiar-estado">
              <button onClick={() => cambiarLeida(notificacion.id,accionesDeLectura(notificacion.leida).estado)}>{accionesDeLectura(notificacion.leida).textoBotonCambio}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


ListaNotificaciones.propTypes = {
  mensaje: PropTypes.string,
};
const accionesDeLectura = Object.freeze(
    (Leida) => {
        if(Leida){
            return {
                "textoBotonCambio": "Marcar como no leida",
                "estado": false,
                "textoItem": "Leida"
            }
        }
        else{
            return {
                "textoBotonCambio": "Marcar como leida",
                "estado": true,
                "textoItem": "No Leida"
            };
        }
}
);

const botonesNombreSegunEstado=Object.freeze({
  "cancelado":"Cancelar Pedido",
  "enviado":"Marcar como Enviado",
});
