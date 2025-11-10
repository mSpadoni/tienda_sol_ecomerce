// src/provieder/carritoProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useCurrency } from "./CurrencyProvider.jsx";

// Crear contexto
const CarritoContext = createContext();
export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const { convert } = useCurrency();

  // Inicializar carrito desde localStorage o vacío
  const [carrito, setCarrito] = useState(() => {
    const stored = localStorage.getItem("carrito");
    return stored ? JSON.parse(stored) : [];
  });

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Estado para total convertido
  const [total, setTotal] = useState(0);

  // Recalcular total cada vez que el carrito o la moneda cambian
  useEffect(() => {
    const calcularTotal = async () => {
      let t = 0;
      for (const item of carrito) {
        //const precioConvertido = await convert(item.producto.precio, item.producto.moneda);
        t += item.producto.precio * item.cantidad;
      }
      setTotal(t);
    };
    calcularTotal();
  }, [carrito, convert]);

  // Agregar item al carrito
  const agregarItem = (producto, cantidad) => {
    const existe = carrito.some((item) => item.producto._id === producto._id);
    if (existe) {
      aumentarCantidad(producto._id, cantidad);
    } else {
      setCarrito((prev) => [...prev, { producto, cantidad }]);
    }
  };

  // Aumentar cantidad
  const aumentarCantidad = (id, cantidad) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.producto._id === id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      )
    );
  };

  // Disminuir cantidad, eliminar si llega a 0
  const disminuirCantidad = (id, cantidad) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.producto._id === id
            ? { ...item, cantidad: item.cantidad - cantidad }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // Eliminar producto
  const eliminarDelCarrito = (id) =>
    setCarrito((prev) => prev.filter((item) => item.producto._id !== id));

  // Limpiar todo el carrito
  const limpiarCarrito = () => setCarrito([]);

  // Chequear si el carrito está vacío
  const carritoVacio = () => carrito.length === 0;

  // Obtener cantidad de un producto específico
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
