import React from "react";
import DrawerOverlay from "./DrawerOverlay.jsx";
import PropTypes from "prop-types";

const CarritoDrawer = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <DrawerOverlay onClick={onClose} />
      <div
        className="carrito-drawer izquierda abierto"
        id="carrito-drawer"
        role="dialog"
        aria-label="Panel del carrito de compras"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  );
};

export default CarritoDrawer;

CarritoDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
