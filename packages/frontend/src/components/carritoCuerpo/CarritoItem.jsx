import React, { useState } from "react";
import PropTypes from "prop-types";
import "./CarritoItem.css";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";

const CarritoItem = ({ item, onEliminarCantidad }) => {
  const [cantidadEliminar, setCantidadEliminar] = useState(0);
  const { currency } = useCurrency();
  const aumentar = () => {
    if (cantidadEliminar < item.cantidad) setCantidadEliminar(cantidadEliminar + 1);
  };
  const disminuir = () => {
    if (cantidadEliminar > 0) setCantidadEliminar(cantidadEliminar - 1);
  };

  return (
    <div className="carrito-item">
      <img src={item.producto.imagen} alt={item.producto.titulo} className="item-img"/>
      <div className="item-info">
        <h4 className="item-title">{item.producto.titulo}</h4>
        <div className="item-price">              Precio: {`${CURRENCIES[currency].symbol}${item.producto.precio.toLocaleString(CURRENCIES[currency].locale)}`}</div>

        <div className="item-eliminar">
          <button onClick={disminuir} disabled={cantidadEliminar === 0}>−</button>
          <span>{cantidadEliminar}</span>
          <button onClick={aumentar} disabled={cantidadEliminar === item.cantidad}>+</button>
          <button
            className="eliminar"
            disabled={cantidadEliminar === 0}
            onClick={() => {
              onEliminarCantidad(item.producto.id, cantidadEliminar);
              setCantidadEliminar(0);
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

CarritoItem.propTypes = {
  item: PropTypes.shape({
    producto: PropTypes.shape({
      id: PropTypes.string.isRequired,
      imagen: PropTypes.string,
      titulo: PropTypes.string,
      precio: PropTypes.number,
    }).isRequired,
    cantidad: PropTypes.number.isRequired,
  }).isRequired,
  onEliminarCantidad: PropTypes.func.isRequired,
};

export default CarritoItem;
