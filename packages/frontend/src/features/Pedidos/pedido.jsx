import React, { useEffect, useState } from "react";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import PropTypes from "prop-types";
import Store from "../../components/mockData/Pedidos.js";
import { useMensajes } from "../../provieder/mensajeDeExito.jsx";
import SuccessSnackbar from "../../components/snackBar.jsx";
import "./pedido.css";
import { useNavigate } from "react-router-dom";

import { useKeycloak } from "../../provieder/keyCloak.jsx"

// Material UI
import {
  IconButton,
  Menu,
  MenuItem,
  Button as MUIButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Padding } from "@mui/icons-material";

export default function ListaPedidos({
  funcionDeFiltrado,
  estadoACambiar,
  mensaje,
  existoMessage,
  ruta,
}) {
  const [pedidos, setPedidos] = useState([]);
  const { currency } = useCurrency();
  const { setMensajeExito } = useMensajes();
  const navigate = useNavigate();

  // 🔹 roles del usuario
  const { elUsuarioEsUn } = useKeycloak();
  const esVendedor = elUsuarioEsUn("vendedor");
  const esComprador = elUsuarioEsUn("comprador");

  // 🔹 Menú 3 puntitos
  const [anchorEl, setAnchorEl] = useState(null);
  const menuAbierto = Boolean(anchorEl);

  const abrirMenu = (event) => setAnchorEl(event.currentTarget);
  const cerrarMenu = () => setAnchorEl(null);

  useEffect(() => {
    setPedidos(funcionDeFiltrado(Store.Pedidos));
  }, [funcionDeFiltrado]);

  const cambiarEstado = (idPedido) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === idPedido ? { ...pedido, estado: estadoACambiar } : pedido
      )
    );

    setMensajeExito(existoMessage);
    navigate(ruta);
  };

  const cancelar = () => {
    console.log("ACCION: cancelar");
    cerrarMenu();
  };

  const rechazar = () => {
    console.log("ACCION: rechazar");
    cerrarMenu();
  };

  if (pedidos.length === 0) {
    return <div className="no-pedidos">{mensaje}</div>;
  }

  return (
    <div className="lista-pedidos-container">
      <SuccessSnackbar />

      {pedidos.map((pedido) => (
        <div key={pedido.id} className="pedido-card">
          <div className="pedido-header">
            <div className="pedido-total">
              Total:{" "}
              {`${CURRENCIES[pedido.moneda].symbol} ${pedido.total.toLocaleString(
                CURRENCIES[pedido.moneda].locale
              )} `}
            </div>

            {/* 🔹 ICONO DE 3 PUNTITOS */}
            <IconButton onClick={abrirMenu} className="puntosMenu">
              <MoreVertIcon />
            </IconButton>

            {/* 🔹 MENU DESPLEGABLE */}
            <Menu anchorEl={anchorEl} open={menuAbierto} onClose={cerrarMenu}>
              {esComprador && <MenuItem sx={itemStyles} onClick={cancelar}>{botonesNombreSegunEstado[estadoACambiar]}</MenuItem>}
              {esVendedor && <MenuItem sx={itemStyles} onClick={rechazar}>Rechazar</MenuItem>}
            </Menu>
          </div>

          <div className="pedido-body">
            <div className="pedido-items">
              <h5>Productos:</h5>
              <ul>
                {pedido.items.map((item) => (
                  <li key={item.producto._id}>
                    {item.producto.titulo} - Cantidad: {item.cantidad}
                  </li>
                ))}
              </ul>
            </div>

            {!estadoNegativos.includes(estadoACambiar) && <div className="pedido-actions">
              {/* 🔹 BOTÓN MUI (ENVÍAR O CAMBIAR ESTADO) */}
              <MUIButton
                variant="contained"
                color='success'
                sx={enviarStyles}
                onClick={() => cambiarEstado(pedido.id)}
              >
                {botonesNombreSegunEstado[estadoACambiar]} 
              </MUIButton>
            </div>}
          </div> 

          <div className="pedido-detalles">
            <p>
              <strong>Dirección:</strong>{" "}
              {`${pedido.direccionEntrega.calle}, ${pedido.direccionEntrega.altura} ${
                pedido.direccionEntrega.piso
                  ? "Piso " + pedido.direccionEntrega.piso
                  : ""
              } ${pedido.direccionEntrega.departamento || ""}, ${
                pedido.direccionEntrega.ciudad
              }`}
            </p>

            <p>
              <strong>Estado:</strong> {pedido.estado}
            </p>

            <p>
              <strong>Fecha:</strong>{" "}
              {pedido.Fecha.toLocaleDateString(CURRENCIES[currency].locale)}
            </p>
          </div>
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
  ruta: PropTypes.string.isRequired,
};

const itemStyles = {
  fontWeight: 500,
  fontSize: "1rem",
  transition: "all 0.4s ease",
  
  "&:hover": {
    backgroundColor: "#b71c1c !important",
    color: "whitesmoke",
  },
};

const enviarStyles = {
  fontWeight: 500,
  fontSize: "0.8rem",
  transition: "all 0.4s ease",
};

 const botonesNombreSegunEstado = Object.freeze({
  cancelado: "Cancelar",
   enviado: "Enviar",
    rechazado: "Rechazar",
 });

const estadoNegativos = ["cancelado", "rechazado"];
