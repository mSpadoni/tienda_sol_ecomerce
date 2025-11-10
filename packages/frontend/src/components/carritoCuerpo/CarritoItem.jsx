import React from "react";
import PropTypes from "prop-types";
import "./CarritoItem.css";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import { useCarrito } from "../../provieder/carritoProvider";
import { FaTrashAlt } from "react-icons/fa"; // 🗑️ Icono de basura


const CarritoItem = ({ item }) => {
  const { currency } = useCurrency();
  const {
    eliminarDelCarrito,
    aumentarCantidad,
    disminuirCantidad,
    obtenerCantidad,
    carritoVacio,
  } = useCarrito();
   const placeholder = `https://via.placeholder.com/90x90?text=${encodeURIComponent(
  item.producto.titulo || "Producto",
)}`

  const longitud = obtenerCantidad(item.producto._id);
  
  return (
    <div className="carrito-item">
      <img
        src={
                            item.producto.fotos
                              ? `/images/${item.producto.fotos}`
                              : placeholder
                          }
        alt={item.producto.titulo}
        className="item-img"
      />

      <div className="item-info">
        <h4 className="item-title">{item.producto.titulo}</h4>
        <div className="item-price">
          Precio:{" "}
          {`${CURRENCIES[currency].symbol}${item.producto.precio.toLocaleString(
            CURRENCIES[currency].locale,
          )}`}
        </div>

        <div className="item-eliminar-container">
          <div className="item-cantidad">
            <button
              className="btn-cantidad"
              onClick={() => disminuirCantidad(item.producto._id, 1)}
              disabled={carritoVacio()}
            >
              −
            </button>
            <span>{longitud}</span>
            <button
              className="btn-cantidad"
              onClick={() => aumentarCantidad(item.producto._id, 1)}
            >
              +
            </button>
          </div>

          <button
            className="eliminar"
            disabled={carritoVacio()}
            onClick={() => eliminarDelCarrito(item.producto._id)}
            title="Eliminar producto"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

CarritoItem.propTypes = {
  item: PropTypes.shape({
    producto: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fotos: PropTypes.string,
      titulo: PropTypes.string,
      precio: PropTypes.number,
    }).isRequired,
    cantidad: PropTypes.number.isRequired,
  }).isRequired,
};

export default CarritoItem;
