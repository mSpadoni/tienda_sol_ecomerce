import React, { useState } from "react";
import "./ProductsCarousel.css";
import productos from "./mockData/Productos.js";
import CarouselItem from "./ProductoItem/CarouselItem.jsx";

const ProductsCarousel = () => {
  const [index, setIndex] = useState(0);
  const visible = 3; // cantidad de items visibles en el carrusel
    return (
        <div className="carousel-container">
      <h2 className="carousel-title">Ofertas para el fin de semana</h2>

      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}
          >
            {productos.map((product) => (
              <CarouselItem product={product} key={product.id} />
            ))}
          </div>
        </div>
        </div>
    </div>
    );
};

export default ProductsCarousel;
