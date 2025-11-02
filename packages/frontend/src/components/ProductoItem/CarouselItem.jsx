import React from "react";
import PropTypes from 'prop-types';
import "./CarouselItem.css";
import { Link } from "react-router-dom";   
import "../../index.css"
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";


const CarouselItem = ({ product }) => {
  const { currency } = useCurrency();
   // debug temporal: inspecciona la estructura del producto si sigues viendo undefined
  console.debug("CarouselItem product:", product, "resolved id:", product._id);
  return (
    <div key={product._id} className="carousel-card">
      <Link to={`/productos/${product._id}`} className="link-no-style">
        <div className="product-card">
          <img
            src={product.imagen}
            alt={product.titulo}
            className="product-image"
          />
          <div className="product-info">
            <h3 className="product-name">{product.titulo}</h3>
            <div className="product-details">
              <span className="product-price">
               Precio: {`${CURRENCIES[currency].symbol}${product.precio.toLocaleString(CURRENCIES[currency].locale)}`}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

CarouselItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imagen: PropTypes.string,
    titulo: PropTypes.string,
    precio: PropTypes.number,
    moneda: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      simbolo: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CarouselItem;