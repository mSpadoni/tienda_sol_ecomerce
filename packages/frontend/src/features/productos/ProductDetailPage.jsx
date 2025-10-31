import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ButtonGroup, Button } from "@mui/material";
import productos from "../../components/mockData/Productos.js";
import { useCarrito } from "../../provieder/carritoProvider.jsx";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === id);
  const { agregarAlCarrito } = useCarrito();
  const [stock, setStock] = useState(0);
  const { currency } = useCurrency();


  // Reiniciar stock cuando cambia el producto
  useEffect(() => setStock(0), [id]);



  const aumentarStock = () => setStock(stock + 1);
  const disminuirStock = () => stock > 0 && setStock(stock - 1);

  if (!producto) return <div>Producto no encontrado</div>;

  return (
    <div className="producto-detail-container">
      <div className="producto-header">
        <h1 className="producto-nombre">{producto.titulo}</h1>
      </div>

      <div className="producto-content">
        <div className="producto-image-section">
          <img src={producto.imagen} alt={producto.titulo} className="producto-imagen" />
        </div>

        <div className="producto-info-section">
          <p className="producto-description">{producto.descripcion}</p>
          <div className="producto-price-section">
            <div className="producto-precio">
              
              Precio: {`${CURRENCIES[currency].symbol}${producto.precio.toLocaleString(CURRENCIES[currency].locale)}`}
            </div>
            <div className="price-details">Impuestos incluidos</div>

            <div className="comprar-container">
              <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button onClick={disminuirStock} disabled={stock === 0}>-</Button>
                <Button disabled>{stock}</Button>
                <Button onClick={aumentarStock}>+</Button>
              </ButtonGroup>
              <Button
                className="comprar"
                disabled={stock === 0}
                onClick={() => agregarAlCarrito(producto, stock)}
              >
                Comprar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

