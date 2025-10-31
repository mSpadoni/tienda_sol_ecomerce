import "./pedido.css";
import React, { useState } from "react";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import PropTypes from "prop-types";



export default function ListaPedidos({ pedidos, estadoACambiar}) {
  const [openId, setOpenId] = useState(null);
  const { currency } = useCurrency();
  
  const cambiarEstado=(idPedido)=>{
    // Lógica para cambiar el estado del pedido con idPedido
    console.log(`Cambiar estado del pedido con ID: ${idPedido} a ${estadoACambiar}`);
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
            <div className="pedido-header">
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
              Total: 
              {pedido.total.toLocaleString()}
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
                    {`${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura} ${
                      pedido.direccionEntrega.piso ? "Piso " + pedido.direccionEntrega.piso : ""
                    } ${pedido.direccionEntrega.departamento || ""}, ${pedido.direccionEntrega.ciudad}`}
                  </p>
                  <p>
                    <strong>Estado:</strong> {pedido.estado}
                  </p>
         
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {pedido.Fecha.toLocaleDateString(CURRENCIES[currency].locale)}
                  </p>
                </div>
              )}
            </div>

            <div className="pedido-cambiar-estado">
              <button onClick={() => cambiarEstado(pedido.id)}>{estadoACambiar}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const PedidoPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  usuario: PropTypes.number.isRequired,
  vendedor: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      producto: PropTypes.shape({
        id: PropTypes.number.isRequired,
        titulo: PropTypes.string.isRequired,
      }).isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ).isRequired,
  direccionEntrega: PropTypes.shape({
    calle: PropTypes.string.isRequired,
    altura: PropTypes.string.isRequired,
    piso: PropTypes.string,
    departamento: PropTypes.string,
    codigoPostal: PropTypes.string.isRequired,
    ciudad: PropTypes.string.isRequired,
    provincia: PropTypes.string.isRequired,
    pais: PropTypes.string.isRequired,
    lat: PropTypes.string,
    long: PropTypes.string,
  }).isRequired,
  moneda: PropTypes.string.isRequired, // <--- ahora es string
  estado: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  Fecha: PropTypes.instanceOf(Date).isRequired,
});

ListaPedidos.propTypes = {
  pedidos: PropTypes.arrayOf(PedidoPropType).isRequired,
  estadoACambiar: PropTypes.string.isRequired,
};
