import React, { useEffect, useState } from "react";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import PropTypes from "prop-types";
import Store from "../../components/mockData/Pedidos.js";
import { useMensajes } from "../../provieder/mensajeDeExito.jsx";
import SuccessSnackbar from "../../components/snackBar.jsx";
import "./pedido.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ListaPedidos({ funcionDeFiltrado, estadoACambiar, mensaje, existoMessage }) {
  const [openId, setOpenId] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const { currency } = useCurrency();
  const { setMensajeExito } = useMensajes();
  const navigate=useNavigate()
  useEffect(() => {
    setPedidos(funcionDeFiltrado(Store.Pedidos));
  }, [funcionDeFiltrado]);

  const cambiarEstado = (idPedido) => {
    // Buscar el pedido dentro del store
    const pedidoEncontrado = Store.Pedidos.find(p => p.id === idPedido);

    if (pedidoEncontrado) {
      pedidoEncontrado.estado = estadoACambiar;
      setMensajeExito(existoMessage);

      // Actualizar lista local para reflejar el cambio visualmente
      setPedidos([...Store.Pedidos,pedidoEncontrado]);
      navigate(`pedidos/hechos`)
    }
  };

  if (pedidos.length === 0) {
    return <div className="no-pedidos">{mensaje}</div>;
  }

  return (
    
    <div className="lista-pedidos-container">
      <SuccessSnackbar/>
      {pedidos.map((pedido) => (
        <div key={pedido.id} className="pedido-card">
          <div className="pedido-header">
            <div className="pedido-total">
              Total: {`${CURRENCIES[pedido.moneda].symbol} ${pedido.total.toLocaleString(CURRENCIES[pedido.moneda].locale)} `}
            </div>
          </div>

          <div className="pedido-body">
            <div className="pedido-items">
              <h5>Productos:</h5>
              <ul>
                {pedido.items.map((item) => (
                  <li key={item.producto.id}>
                    {item.producto.titulo} - Cantidad: {item.cantidad}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pedido-actions">
              <button
                onClick={() => setOpenId(openId === pedido.id ? null : pedido.id)}
                className="btn-ver-detalles"
              >
                {openId === pedido.id ? "Ocultar info" : "Ver detalles"}
              </button>

              <Button
                onClick={() => cambiarEstado(pedido.id)}
                disabled={pedido.estado === estadoACambiar}
                className="btn-cambiar-estado"
              >
                {botonesNombreSegunEstado[estadoACambiar]}
              </Button>
            </div>
          </div>

          {openId === pedido.id && (
            <div className="pedido-detalles">
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
                {pedido.Fecha.toLocaleDateString(CURRENCIES[currency].locale)}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

ListaPedidos.propTypes = {
  funcionDeFiltrado: PropTypes.func.isRequired,
  estadoACambiar: PropTypes.string.isRequired,
  mensaje: PropTypes.string.isRequired,
  existoMessage: PropTypes.string.isRequired,
};

const botonesNombreSegunEstado = Object.freeze({
  cancelado: "Cancelar Pedido",
  enviado: "Marcar como Enviado",
});
