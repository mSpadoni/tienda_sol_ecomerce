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
import { cambiarEstado }from "../../services/pedidoService.js"
// Material UI
import { IconButton, Menu, MenuItem, Button as MUIButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Padding } from "@mui/icons-material";
//import { get } from "mongoose";

export default function ListaPedidos({
  pathBackend,
  tipoDePedidos,
  estadoACambiar,
  mensaje,
  existoMessage,
  ruta,
}) {
  const [pedidos, setPedidos] = useState([]);
  const { currency } = useCurrency();
  const { setMensajeExito } = useMensajes();
  const navigate = useNavigate();

  const { elUsuarioEsUn } = useKeycloak();
  const esVendedor = elUsuarioEsUn("vendedor");
  const esComprador = elUsuarioEsUn("comprador");

  const [anchorEl, setAnchorEl] = useState(null);
  const menuAbierto = Boolean(anchorEl);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [motivoSeleccionado, setMotivoSeleccionado] = useState("");
  const [accionActual, setAccionActual] = useState(null); // "cancelado" | "rechazado"
  const [pedidoACambiar, setPedidoACambiar] = useState("");

  const abrirMenu = (event) => setAnchorEl(event.currentTarget);
  const cerrarMenu = () => setAnchorEl(null);

useEffect(() => {
  const cargar = async () => {
    try {
      const pedidos = await getPedidos(pathBackend);
      setPedidos(pedidos);
    } catch (err) {
      console.error(err);
    }
  };

  cargar();
}, [pathBackend]);

const cancelar = () => {
  setAccionActual("cancelado");
  setDialogOpen(true);
  cerrarMenu();
};

const rechazar = () => {
  setAccionActual("rechazado");
  setDialogOpen(true);
  cerrarMenu();
};


const confirmarMotivo = () => {
  const motivoFinal =
    motivoSeleccionado === "otro" ? motivo : motivoSeleccionado;

  if (!motivoFinal.trim()) return;


  cambiarEstado(pedidoACambiar,accionActual,motivoFinal);

  setDialogOpen(false);
  setMotivo("");
  setMotivoSeleccionado("");
};


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
            <IconButton onClick={abrirMenu} className="puntosMenu">
              <MoreVertIcon />
            </IconButton>

            {/* MENU DESPLEGABLE */}
            <Menu anchorEl={anchorEl} open={menuAbierto} onClose={cerrarMenu}>
              {esComprador && <MenuItem sx={itemStyles} onClick={() => { setPedidoACambiar(pedido.id); cancelar(); }}>{botonesNombreSegunEstado[estadoACambiar]}</MenuItem>}
              {esVendedor && <MenuItem sx={itemStyles} onClick={() => { setPedidoACambiar(pedido.id); rechazar(); }}>Rechazar</MenuItem>}
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

            {!estadoNegativos.includes(estadoACambiar) && <div className="pedido-actions">
              {/*  BOTÓN MUI (ENVÍAR O CAMBIAR ESTADO) */}
              <MUIButton
                variant="contained"
                color='success'
                sx={enviarStyles}
                onClick={() => cambiarEstado(pedido.id,estadoACambiar,"")}
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
