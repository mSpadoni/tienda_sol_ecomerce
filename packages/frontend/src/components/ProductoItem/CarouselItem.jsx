import React from "react";
import PropTypes from 'prop-types';
import "./CarouselItem.css";
import { Link } from "react-router-dom";   
import "../../index.css"

const CarouselItem = ({product}) => {
  return (
    <div key={product.id} className="carousel-card">
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
              desde: ${product.precio.toLocaleString("es-AR")} / noche
            </span>
          </div>
          <div className="ver-detalles-container">
            <span className="ver-detalles">
              <Link to={`/productos/${product.id}`} className="link-no-style">Ver Detalles</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

CarouselItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imagen: PropTypes.string,
    titulo: PropTypes.string,
    precio: PropTypes.number,
  }).isRequired,
};

export default CarouselItem