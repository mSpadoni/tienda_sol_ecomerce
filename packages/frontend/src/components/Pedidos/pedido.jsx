import "./pedido.css";
import React, { useEffect, useState } from "react";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import PropTypes from "prop-types";
import Store from "../mockData/Pedidos.js";




export default function ListaPedidos({ funcionDeFiltrado, estadoACambiar,mensaje}) {
  const [openId, setOpenId] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const { currency } = useCurrency();
  
 useEffect(() => {setPedidos(funcionDeFiltrado(Store.Pedidos));
  }, [funcionDeFiltrado]);

  const cambiarEstado=(idPedido)=>{
    // Lógica para cambiar el estado del pedido con idPedido
    console.log(`Cambiar estado del pedido con ID: ${idPedido} a ${estadoACambiar}`);
  }

  if (pedidos.length === 0) {
    return <div style={{ padding: 20 }}>{mensaje}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            marginBottom: 10,
            padding: 10,
          }}
        >
          <div className="pedido-info">
            <div className="pedido-info-visible">
              <h4>Productos:</h4>
              <ul>
                {pedido.items.map((item) => (
                  <li key={item.producto.id}>
                    {item.producto.titulo} - Cantidad: {item.cantidad}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pedido-precio">
              Total: {`${CURRENCIES[pedido.moneda].symbol}
              ${pedido.total.toLocaleString(CURRENCIES[pedido.moneda].locale)} `}
            </div>

            <div className="pedido-desplegable">
              <button
                onClick={() => setOpenId(openId === pedido.id ? null : pedido.id)}
                style={{ marginLeft: 10 }}
              >
                {openId === pedido.id ? "Ocultar info" : "Ver detalles"}
              </button>
            </div>

            <div className="pedido-detalles">
              {openId === pedido.id && (
                <div style={{ marginTop: 10 }}>
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {`${pedido.direccionEntrega.calle}, ${pedido.direccionEntrega.altura} ${
                      pedido.direccionEntrega.piso ? "Piso " + pedido.direccionEntrega.piso : ""
                    } ${pedido.direccionEntrega.departamento || ""}, ${pedido.direccionEntrega.ciudad}`}
                  </p>
                  <p>
                    <strong>Estado:</strong> {pedido.estado}
                  </p>
         
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {pedido.Fecha.toLocaleDateString(CURRENCIES[currency].locale)}{" "}
                  </p>
                </div>
              )}
            </div>

            <div className="pedido-cambiar-estado">
              <button onClick={() => cambiarEstado(pedido.id)}>{botonesNombreSegunEstado[estadoACambiar]}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


ListaPedidos.propTypes = {
  funcionDeFiltrado: PropTypes.func.isRequired,
  estadoACambiar: PropTypes.string.isRequired,
  mensaje: PropTypes.string,
};

const botonesNombreSegunEstado=Object.freeze({
  "cancelado":"Cancelar Pedido",
  "enviado":"Marcar como Enviado",
});
