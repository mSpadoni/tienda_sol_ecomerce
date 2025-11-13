import React, { useEffect, useState } from "react";
import { useCarrito } from "../../provieder/carritoProvider";
import CarritoItem from "./CarritoItem.jsx";
import { useNavigate } from "react-router-dom";
import "./carritoCuerpo.css";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useVisible } from "../../provieder/visibleHook.jsx";

const CarritoCuerpo = ({ onClose }) => {
  const { carrito, carritoVacio, total } = useCarrito();
  const navigate = useNavigate();
  const { ponerInvisible } = useVisible();

  const comprar = () => {
    onClose();
    navigate("/checkout");
    ponerInvisible();
  };

  useEffect(() => {
    if (carritoVacio()) {
      onClose();
    }
  }, [carrito.length, total, carritoVacio, onClose]);

  return (
    <aside className="rappi-carrito" role="region" aria-label="Carrito de compras">
      <h2>Carrito de compras</h2>

      <div className="rappi-items-container" role="list">
        {carrito.map((item) => (
          <div key={item.producto.id} role="listitem">
            <CarritoItem item={item} />
          </div>
        ))}
      </div>

      <div className="rappi-footer">
        <div className="rappi-total" aria-live="polite" aria-atomic="true">
          <strong>Total: ${total.toLocaleString("es-AR")}</strong>
        </div>
        <div className="rappi-boton-comprar-container">
          <Button
            className="rappi-comprar-button"
            disable={() => carrito.length === 0}
            onClick={comprar}
            aria-label={`Proceder a comprar - ${carrito.length} artículos en el carrito`}
          >
            Comprar
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default CarritoCuerpo;

CarritoCuerpo.propTypes = {
  onClose: PropTypes.func.isRequired,
};