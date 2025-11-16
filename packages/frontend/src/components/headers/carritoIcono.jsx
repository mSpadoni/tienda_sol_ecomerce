import React from "react";
import PropTypes from "prop-types";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../provieder/carritoProvider.jsx";
import { useVisible } from "../../provieder/visibleHook.jsx";
import { IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CarritoIcono = () => {
  const { carrito, carritoVacio } = useCarrito();
  const { isVisible } = useVisible();
  const navigate = useNavigate();
  const carritoLongitud = carrito.length;

  const irAlCarrito = () => {
    navigate("/carrito");
  };

  return (
    <>
      {isVisible && (
        <Badge
          badgeContent={carritoLongitud}
          color="error"
          invisible={carritoLongitud === 0}
        >
          <IconButton
            onClick={irAlCarrito}
            disabled={carritoVacio()}
            aria-label={`Carrito de compras, ${carritoLongitud} artículos`}
            aria-controls="carrito-page"
            aria-disabled={carritoVacio()}
            size="large"
          >
            <ShoppingCartIcon
              sx={{
                color: "#fffefeff",
                transition: "0.3s",
                fontSize: 27,
                "&:hover": {
                  transform: "scale(1.3)",
                },
              }}
            />
          </IconButton>
        </Badge>
      )}
    </>
  );
};

CarritoIcono.propTypes = {};

export default CarritoIcono;
