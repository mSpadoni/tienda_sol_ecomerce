import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useMensajes } from "../provieder/mensajeDeExito";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SuccessSnackbar = () => {
  const { mensajeExito, limpiarMensajes } = useMensajes();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    limpiarMensajes();
  };

  return (
    <Snackbar
      open={!!mensajeExito}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx = {{ mt: 8 }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Notificación de éxito"
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
        role="alert"
        aria-label={`Mensaje de éxito: ${mensajeExito}`}
      >
        {mensajeExito}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;
