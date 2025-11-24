import React, { useEffect, useState } from "react";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import PropTypes from "prop-types";
import Store from "../../components/mockData/Pedidos.js";
import { useMensajes } from "../../provieder/mensajeDeExito.jsx";
import SuccessSnackbar from "../../components/snackBar.jsx";
import "./pedido.css";
import { useNavigate } from "react-router-dom";
import {getPedidos} from "../../services/pedidoService.js";
import { useKeycloak } from "../../provieder/keyCloak.jsx"
import { ClipLoader } from "react-spinners";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { cambiarEstado }from "../../services/pedidoService.js"
// Material UI
import { IconButton, Menu, MenuItem, Button as MUIButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Padding } from "@mui/icons-material";
import { createTheme } from '@mui/material/styles';
//import { get } from "mongoose";

export default function ListaPedidos({
  pathBackend,
  tipoDePedidos,
  estadoParaAvanzar,
  estadoParaAbortar,
  estadoParaMostrar,
  mensaje,
  funcionDeOrdenamiento,
}) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();
  const { setMensajeExito } = useMensajes();
  const navigate = useNavigate();

  // 🔹 roles del usuario
  const { elUsuarioEsUn, isAuthenticated } = useKeycloak();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuAbierto = Boolean(anchorEl);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [motivoSeleccionado, setMotivoSeleccionado] = useState("");
  const [accionActual, setAccionActual] = useState(null); // "cancelado" | "rechazado"
  const [pedidoACambiar, setPedidoACambiar] = useState("");

  const abrirMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setPedidoACambiar(id);
  };
  const cerrarMenu = () => {
    setAnchorEl(null);
  };

const cargarPedidos = async () => {
  setLoading(true);
  try {
    const pedidos = await getPedidos(pathBackend);
    setPedidos(funcionDeOrdenamiento(pedidos));
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  setPedidos([]);
  cargarPedidos();
}, [pathBackend, isAuthenticated]);

const desplegar = (estado,pedidoId) => {
  console.log("id",pedidoId);
  setPedidoACambiar(pedidoId);
  setAccionActual(estado);
  setDialogOpen(true);
  cerrarMenu();
}


const confirmarMotivo = async () => {
  const motivoFinal = 
    motivoSeleccionado === "otro" ? motivo : motivoSeleccionado;

  if (!motivoFinal.trim()) return;

  try {
    await cambiarEstado(pedidoACambiar, accionActual, motivoFinal);
    setMensajeExito("Pedido actualizado correctamente");
    await cargarPedidos();
  } catch (err) {
    console.error("Error al cambiar estado:", err);
  }

  setDialogOpen(false);
  setMotivo("");
  setMotivoSeleccionado("");
  setPedidoACambiar("");
};


  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <ClipLoader color="#0D47A1" size={48} />
      </div>
    );
  }

  if (pedidos.length === 0) {
    return <div className="no-pedidos">{mensaje}</div>;
  }

  return (
    <div className="lista-pedidos-container">

      {/* PopUp de ingreso de motivo */}
      <Dialog open={dialogOpen} onClose={() => {}} disableEscapeKeyDown>
      <DialogTitle>
        {accionActual === "cancelado"
          ? "Motivo de cancelación"
          : "Motivo de rechazo"}
      </DialogTitle>
        
      <DialogContent>
        <FormControl>
          <RadioGroup
            value={motivoSeleccionado}
            onChange={(e) => setMotivoSeleccionado(e.target.value)}
          >
            {(tipoDePedidos == "hechos" ? motivosComprador : motivosVendedor).map((opcion, i) => (
              <FormControlLabel
                key={i}
                value={opcion}
                control={<Radio />}
                label={opcion}
              />
            ))}

            <FormControlLabel
              value="otro"
              control={<Radio />}
              label="Otro (especificar)"
            />
          </RadioGroup>
        </FormControl>

        {/* Campo de texto solo si elige "otro" */}
        {motivoSeleccionado === "otro" && (
          <TextField
            autoFocus
            margin="dense"
            label="Ingrese el motivo"
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setDialogOpen(false);
            setMotivo("");
            setMotivoSeleccionado("");
            setPedidoACambiar("");
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={confirmarMotivo}
          disabled={
            !motivoSeleccionado ||
            (motivoSeleccionado === "otro" && !motivo.trim())
          }
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
      <SuccessSnackbar />

      {pedidos.map((pedido) => (
        <div key={pedido.id} className="pedido-card">
          <div className="pedido-header">
            <div className="pedido-total">
              Total:{" "}
              {`${CURRENCIES[pedido.moneda.nombre].symbol} ${pedido.total.toLocaleString(
                CURRENCIES[pedido.moneda.nombre].locale
              )} `}
            </div>

            {/* ICONO DE 3 PUNTITOS */}
            <IconButton onClick={(e) => abrirMenu(e, pedido.id)} className="puntosMenu">
              <MoreVertIcon />
            </IconButton>

            {/* MENU DESPLEGABLE */}
            <Menu anchorEl={anchorEl} open={menuAbierto} onClose={cerrarMenu}>
              <MenuItem sx={itemStyles} onClick={() => { desplegar(estadoParaAbortar,pedido.id) }}>{botonesNombreSegunEstado[estadoParaAbortar]}</MenuItem>
            </Menu>
          </div>

          <div className="pedido-body">
            <div className="pedido-items">
              <h5>Productos:</h5>
              <ul>
                {pedido.items.map((item) => (
                  //to do: la API del back no devuelve el ID, ver si se puede usar algo mas lindo de key
                  <li key={item.titulo}>
                    {item.titulo} - Cantidad: {item.cantidad}
                  </li>
                ))}
              </ul>
            </div>

            {pedido.estado.valor == estadoParaMostrar && <div className="pedido-actions">
              {/*  BOTÓN MUI (ENVÍAR O CAMBIAR ESTADO) */}
              <MUIButton
                variant="contained"
                sx={{
                    ...enviarStyles,
                    backgroundColor: '#0D47A1',
                    '&:hover': {
                      backgroundColor: '#0D3A8E',
                    }
                  }}

                onClick={async () => {
                  try {
                    await cambiarEstado(pedido.id, estadoParaAvanzar, "El pedido fue enviado");
                    setMensajeExito("Pedido actualizado correctamente");
                    await cargarPedidos();
                  } catch (err) {
                    console.error("Error al cambiar estado:", err);
                  }
                }}
              >
                {botonesNombreSegunEstado[estadoParaAvanzar]} 
              </MUIButton>
            </div>}
          </div> 

          <div className="pedido-detalles">
            <p>
              <strong>Dirección:</strong>{" "}
              {`${pedido.direccionEntrega.calle}, ${pedido.direccionEntrega.altura} ${
                pedido.direccionEntrega.piso
              }
                Piso ${pedido.direccionEntrega.piso}
                
               ${pedido.direccionEntrega.departamento || ""}, ${
                 pedido.direccionEntrega.ciudad
               }`}
            </p>

            <p>
              <strong>Estado:</strong> {pedido.estado.valor}
            </p>

            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(pedido.fechaCreacion).toLocaleDateString(CURRENCIES[currency].locale)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

ListaPedidos.propTypes = {
  pathBackend: PropTypes.string.isRequired,
  tipoDePedidos: PropTypes.string.isRequired,
  estadoParaAvanzar: PropTypes.string,
  estadoParaAbortar: PropTypes.string,
  estadoParaMostrar: PropTypes.string,
  mensaje: PropTypes.string.isRequired,
  existoMessage: PropTypes.string.isRequired,
  ruta: PropTypes.string.isRequired,
  funcionDeOrdenamiento: PropTypes.func.isRequired,
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
    confirmado: "Confirmar",
    finalizado: "Finalizar",
});



//se prodria pasar por parametro

const motivosComprador = [
  "No confío en el vendedor",
  "Me arrepentí de comprar el producto",
  "Conseguí una oferta mejor en otro lado",
  "Me equivoque al hacer el pedido",
  "El pedido tardo demasiado en llegar",
];

const motivosVendedor = [
  "No confío en el comprador",
  "No hacemos envíos a la dirección solicitada",
  "La informacion de entrega esta mal completada",
  "El comprador nunca estuvo presente para recibir el pedido",
];


const theme = createTheme({
  palette: {
   azul: {
      main: '#051770',
    },
  },
});