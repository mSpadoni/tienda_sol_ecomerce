// src/provieder/carritoProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useCurrency } from "./CurrencyProvider.jsx";

// Crear contexto
const CarritoContext = createContext();
export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const { convert } = useCurrency();

  const [carrito, setCarrito] = useState(() => {
    const stored = localStorage.getItem("carrito");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calcularTotal = async () => {
      let t = 0;
      for (const item of carrito) {
        t += item.producto.precio * item.cantidad;
      }
      setTotal(t);
    };
    calcularTotal();
  }, [carrito, convert]);

  const agregarItem = (producto, cantidad) => {
    const existe = carrito.some((item) => item.producto._id === producto._id);
    if (existe) {
      aumentarCantidad(producto._id, cantidad);
    } else {
      setCarrito((prev) => [...prev, { producto, cantidad }]);
    }
  };

  const aumentarCantidad = (id, cantidad) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.producto._id === id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item,
      ),
    );
  };

  const disminuirCantidad = (id, cantidad) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.producto._id === id
            ? { ...item, cantidad: item.cantidad - cantidad }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const eliminarDelCarrito = (id) =>
    setCarrito((prev) => prev.filter((item) => item.producto._id !== id));

  const limpiarCarrito = () => setCarrito([]);

  const carritoVacio = () => carrito.length === 0;

  const obtenerCantidad = (id) => {
    const item = carrito.find((i) => i.producto._id === id);
    return item ? item.cantidad : 0;
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        total,
        agregarItem,
        aumentarCantidad,
        disminuirCantidad,
        eliminarDelCarrito,
        limpiarCarrito,
        carritoVacio,
        obtenerCantidad,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

CarritoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
