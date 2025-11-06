import { createContext, useContext, useState } from "react";

import React from "react";
import PropTypes from "prop-types";
const CarritoContext = createContext();
export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);


  const agregarItem = (producto, cantidad) => {
  const existe = carrito.some(item => item.producto.id === producto.id);

  if (existe) {
    // Si ya está en el carrito, aumentar la cantidad
    aumentarCantidad(producto.id, cantidad);
  } else {
    // Si no está, agregarlo como nuevo
    setCarrito(prev => [...prev, { producto, cantidad }]);
  }
};


  const aumentarCantidad=(id, cantidad)=>
    {setCarrito(prev =>prev.map(item =>
          item.producto.id === id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item))}
  
 const carritoVacio=()=>carrito.length===0

const disminuirCantidad = (id, cantidad) => {
  setCarrito(prev =>-
    prev
      .map(item =>
        item.producto.id === id ? { ...item, cantidad: item.cantidad - cantidad } : item
      )
      .filter(item => item.cantidad > 0)
  );
};

  const eliminarDelCarrito = (id) =>
  setCarrito(prev => prev.filter(item => item.producto.id !== id));

  const totalPrecio =()=> carrito.reduce(
  (acc, item) => acc +item.producto.precio * item.cantidad,
  0
);

const limpiarCarrito=()=>setCarrito([])
const obtenerCantidad = (id) => {
  const item = carrito.find(i => i.producto.id === id);
  return item ? item.cantidad : 0;
};


  return (
    <CarritoContext.Provider value={{
      agregarItem,
      eliminarDelCarrito,
      totalPrecio,
      carritoVacio,
      aumentarCantidad,
      limpiarCarrito,
      obtenerCantidad,
      disminuirCantidad,
      carrito
    }}>
      {children}
    </CarritoContext.Provider>
  );
};

CarritoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
