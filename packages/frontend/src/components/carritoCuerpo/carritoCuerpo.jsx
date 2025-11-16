import React, { useEffect, useState } from "react";
import { useCarrito } from "../../provieder/carritoProvider";
import CarritoItem from "./CarritoItem.jsx";
import { useNavigate } from "react-router-dom";
import { useVisible } from "../../provieder/visibleHook.jsx";
import { Container, Box, Typography, Button, Stack, Paper } from "@mui/material";
import PropTypes from "prop-types";
import "./carritoCuerpo.css";

const CarritoCuerpo = () => {
  const { carrito, carritoVacio, total } = useCarrito();
  const navigate = useNavigate();
  const { ponerInvisible } = useVisible();

  const comprar = () => {
    navigate("/checkout");
    ponerInvisible();
  };

  useEffect(() => {
    if (carritoVacio()) {
      navigate("/")
    }
  }, [carrito.length, total, carritoVacio]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box role="region" aria-label="Carrito de compras" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}>
          Carrito de compras
        </Typography>

        <Stack spacing={2} sx={{ mb: 4 }}>
          {carrito.map((item) => (
            <div key={item.producto.id} role="listitem">
              <CarritoItem item={item} />
            </div>
          ))}
        </Stack>

        {/* Total Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 3, 
            textAlign: "center",
            backgroundColor: "#f5f5f5"
          }}
        >
          <Typography variant="h6" aria-live="polite" aria-atomic="true">
            <strong>Total: ${total.toLocaleString("es-AR")}</strong>
          </Typography>
        </Paper>

        {/* Button Section */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={carritoVacio()}
            onClick={comprar}
            aria-label={`Proceder a comprar - ${carrito.length} artículos en el carrito`}
            sx={{ minWidth: 200 }}
          >
            Comprar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CarritoCuerpo;

CarritoCuerpo.propTypes = {
  onClose: PropTypes.func,
};