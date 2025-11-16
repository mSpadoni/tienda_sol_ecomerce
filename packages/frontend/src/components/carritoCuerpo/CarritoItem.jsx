import React from "react";
import PropTypes from "prop-types";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import { useCarrito } from "../../provieder/carritoProvider";
import { FaTrashAlt } from "react-icons/fa";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  ButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

const CarritoItem = ({ item }) => {
  const { currency } = useCurrency();
  const {
    eliminarDelCarrito,
    aumentarCantidad,
    disminuirCantidad,
    obtenerCantidad,
    carritoVacio,
  } = useCarrito();

  const cantidadProducto = obtenerCantidad(item.producto._id);

  return (
   <Card
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" }, // columna en mobile, fila en desktop
    width: "100%",
    borderRadius: 2,
    boxShadow: 2,
    p: { xs: 1, sm: 2 },
    gap: { xs: 1, sm: 2 },
  }}
>
  {/* Imagen responsive */}
  <CardMedia
    component="img"
    sx={{
      width: { xs: "100%", sm: 150 },
      height: { xs: 200, sm: 150 },
      objectFit: "contain",
      objectPosition: "center",
      backgroundColor: "#f5f5f5",
      borderRadius: 2,
      mx: "auto", // centra en mobile
    }}
    image={`/images/${item.producto.fotos}`}
    alt={item.producto.titulo}
  />

  {/* Contenido responsive */}
  <CardContent
    sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      textAlign: { xs: "center", sm: "left" }, // centra texto en mobile
      mt: { xs: 1, sm: 0 },
    }}
  >
    <Typography gutterBottom variant="h6">
      {item.producto.titulo}
    </Typography>

    <Typography variant="body2" sx={{ mb: 2 }}>
      Precio: {CURRENCIES[currency].symbol}
      {item.producto.precio.toLocaleString(CURRENCIES[currency].locale)}
    </Typography>

    {/* Controles responsive */}
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent={{ xs: "center", sm: "flex-start" }}
      sx={{ mt: 2 }}
    >
      <ButtonGroup variant="outlined">
        <Button
          onClick={() => disminuirCantidad(item.producto._id, 1)}
          disabled={cantidadProducto <= 1}
        >
          -
        </Button>

        <Button disabled>{cantidadProducto}</Button>

        <Button
          onClick={() => aumentarCantidad(item.producto._id, 1)}
          disabled={cantidadProducto >= item.producto.stock}
        >
          +
        </Button>
      </ButtonGroup>

      <IconButton
        size="small"
        color="error"
        disabled={carritoVacio()}
        onClick={() => eliminarDelCarrito(item.producto._id)}
        sx={{
          "&:hover": { transform: "scale(1.2)" },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  </CardContent>
</Card>
   
  );
};

CarritoItem.propTypes = {
  item: PropTypes.shape({
    producto: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fotos: PropTypes.string,
      titulo: PropTypes.string,
      precio: PropTypes.number,
      stock: PropTypes.number,
    }).isRequired,
    cantidad: PropTypes.number.isRequired,
  }).isRequired,
};

export default CarritoItem;
