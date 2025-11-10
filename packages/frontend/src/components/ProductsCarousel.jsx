import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ProductsCarousel.css";
import defaultProductos from "./mockData/Productos.js";
import CarouselItem from "./ProductoItem/CarouselItem.jsx";
import { useCurrency } from "../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../provieder/currencies.js";

const ProductsCarousel = ({ productos }) => {
  const items = typeof productos === "undefined" ? defaultProductos : productos;
  const [index, setIndex] = useState(0);
  const [productosConvertidos, setProductosConvertidos] = useState([]);
  const visible = 3;

  const { currency, convert } = useCurrency();

  useEffect(() => {
    const convertirPrecios = async () => {
      if (!Array.isArray(items) || items.length === 0) return;

      const nuevosProductos = await Promise.all(
        items.map(async (producto) => {
          const moneda= "ARS" // '"ars"'
          const precioConvertido = producto.precio
          return { ...producto, precioConvertido };
        })
      );

      setProductosConvertidos(nuevosProductos);
      setIndex(0);
    };

    convertirPrecios();
  }, [items, currency]);

  const siguiente = () => {
    if (index < Math.max(0, productosConvertidos.length - visible))
      setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (!Array.isArray(productosConvertidos) || productosConvertidos.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Lo más vendido</h2>
      <div className="carousel-wrapper">
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}
          >
            {productosConvertidos.map((product) => {
              const precioFormateado = product.precioConvertido
                ? `${CURRENCIES[currency].symbol}${product.precioConvertido.toLocaleString(CURRENCIES[currency].locale)}`
                : "";

              return <CarouselItem product={{ ...product, precioFormateado }} key={product._id} />;
            })}
          </div>
        </div>

        <button
          onClick={anterior}
          disabled={index === 0}
          className={`carousel-btn left-btn ${index === 0 ? "disabled" : ""}`}
        >
          ◀
        </button>

        <button
          onClick={siguiente}
          disabled={index >= productosConvertidos.length - visible}
          className={`carousel-btn right-btn ${index >= productosConvertidos.length - visible ? "disabled" : ""}`}
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
