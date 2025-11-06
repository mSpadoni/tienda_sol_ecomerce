import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useMensajes } from "../provieder/mensajeDeExito";// ajusta la ruta

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SuccessSnackbar = () => {
  const { mensajeExito, limpiarMensajes } = useMensajes();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    limpiarMensajes(); // limpia el mensaje cuando se cierra
  };

  return (
    <Snackbar
      open={!!mensajeExito}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }} // arriba derecha
    >
      <Alert
        onClose={handleClose}
        severity="success"
        sx={{
          backgroundColor: "white",
          color: "green",
          fontWeight: "bold",
          boxShadow: 3,
        }}
      >
        {mensajeExito}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;
