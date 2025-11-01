import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "./ProductsCarousel.css";
import defaultProductos from "./mockData/Productos.js";
import CarouselItem from "./ProductoItem/CarouselItem.jsx";

const ProductsCarousel = ({ productos }) => {
  
  const items = typeof productos === 'undefined' ? defaultProductos : productos;

  const [index, setIndex] = useState(0);
  const visible = 3; // cantidad de items visibles en el carrusel

  useEffect(() => {
    setIndex(0);
  }, [productos]);

  const siguiente = () => {
    if (index < Math.max(0, items.length - visible)) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!Array.isArray(items) || items.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Ofertas para el fin de semana</h2>

      <div className="carousel-controls">
        <button onClick={anterior} disabled={index === 0} className="carousel-btn">◀</button>
        <button onClick={siguiente} disabled={index >= items.length - visible} className="carousel-btn">▶</button>
      </div>

      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}
          >
            {items.map((product) => (
              <CarouselItem product={product} key={product.id} />
            ))}
          </div>
        </div>

        <button
          onClick={anterior}
          disabled={index === 0}
          className={`carousel-btn left-btn ${
            index === 0 ? "disabled" : ""
          }`}
        >
          ◀
        </button>

        <button
          onClick={siguiente}
          disabled={index >= productos.length - visible}
          className={`carousel-btn right-btn ${
            index >= productos.length - visible ? "disabled" : ""
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

ProductsCarousel.propTypes = {
  productos: PropTypes.array,
};

export default ProductsCarousel;
