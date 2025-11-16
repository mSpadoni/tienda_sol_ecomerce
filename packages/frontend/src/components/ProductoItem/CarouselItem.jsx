import React from "react";
import PropTypes from "prop-types";
import "./CarouselItem.css";
import { Link } from "react-router-dom";

const CarouselItem = ({ product }) => {
  return (
    <article key={product._id} className="carousel-card">
      <Link
        to={`/productos/${product._id}`}
        className="link-no-style"
        aria-label={`Ver detalles de ${product.titulo}`}
      >
        <div className="product-card">
          <img
            src={`/images/${product.fotos}`}
            alt={product.titulo}
            className="product-imagen"
          />
          <div className="product-info">
            <h3 className="product-name">{product.titulo}</h3>
            <div className="product-details">
              <span
                className="product-price"
                aria-label={`Precio: ${product.precioFormateado || "No disponible"}`}
              >
                Precio: {product.precioFormateado || ""}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

CarouselItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fotos: PropTypes.string,
    titulo: PropTypes.string,
    precioFormateado: PropTypes.string,
  }).isRequired,
};

export default CarouselItem;
