import { createContext, useContext, useState } from "react";

import React from "react";
import PropTypes from "prop-types";
const CarritoContext = createContext();
export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);


  const agregarAlCarrito = (producto, cantidad) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.producto.id === producto.id);
      if (existe) {
        return prev.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { producto, cantidad }];
    });
  };

  const eliminarDelCarrito = (id, cantidad) => {
    setCarrito(prev =>
      prev
        .map(item =>
          item.producto.id === id
            ? { ...item, cantidad: item.cantidad - cantidad }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  };



  const totalPrecio =()=> carrito.reduce(
  (acc, item) => acc +item.producto.precio * item.cantidad,
  0
);


  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      totalPrecio,
      setCarrito,
    }}>
      {children}
    </CarritoContext.Provider>
  );
};

CarritoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
