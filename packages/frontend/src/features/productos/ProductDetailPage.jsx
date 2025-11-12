import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ButtonGroup, Button, Alert, Skeleton } from "@mui/material";
import { getProductoById } from "../../services/ProductosService.js";
import { useCarrito } from "../../provieder/carritoProvider.jsx";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [precioConvertido, setPrecioConvertido] = useState(null);
  const [error, setError] = useState(null);
  const { agregarItem } = useCarrito();
  const { currency } = useCurrency();

  useEffect(() => {
    const cargarProducto = async (productId) => {
      try {
        const prod = await getProductoById(productId);
        setProducto(prod);

        const moneda = prod.moneda;
        console.log(moneda);
        const precio = prod.precio;
        setPrecioConvertido(precio);
      } catch (err) {
        setError(err);
      }
    };
    cargarProducto(id);
  }, [id]);

  useEffect(() => {
    if (producto) setCantidad(producto.stock > 0 ? 1 : 0);
  }, [producto]);

  const aumentarCantidad = () => {
    if (producto && cantidad < producto.stock) setCantidad(cantidad + 1);
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  if (!producto && !error) {
    return (
      <div className="producto-detail-container">
        <div className="producto-content skeleton">
          <div className="producto-image-section-skeleton">
            <Skeleton
              variant="text"
              width={180}
              height={30}
              sx={{ marginBottom: "10px", borderRadius: "4px" }}
            />
            <Skeleton
              variant="rectangular"
              width={320}
              height={260}
              sx={{ borderRadius: "8px" }}
            />
          </div>
          <div className="producto-info-section skeleton-info">
            <Skeleton variant="text" width="70%" height={40} />
            <Skeleton variant="text" width="40%" height={30} />
            <Skeleton
              variant="rectangular"
              width="60%"
              height={25}
              sx={{ borderRadius: "6px", marginTop: "10px" }}
            />
            <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="85%" height={20} />
            <Skeleton variant="text" width="75%" height={20} />
            <Skeleton
              variant="rectangular"
              width="50%"
              height={40}
              sx={{ borderRadius: "8px", mt: 3 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="alert-error">
        {error.message}
      </Alert>
    );
  }

  const hayStock = producto.activo && producto.stock > 0;
  const placeholder = `https://via.placeholder.com/480x360?text=${encodeURIComponent(producto.titulo || "Producto")}`;

  const precioFormateado =
    precioConvertido != null
      ? `${CURRENCIES[currency].symbol}${precioConvertido.toLocaleString(CURRENCIES[currency].locale)}`
      : "Cargando...";

  return (
    <div className="producto-detail-container">
      <div className="producto-header">
        <div>
          <p className="producto-mini-badge">
            {producto.categoria || "Sin categoría"}
          </p>
          <h1 className="producto-nombre">{producto.titulo}</h1>
        </div>
        <div
          className={`producto-stock-badge ${hayStock ? "en-stock" : "sin-stock"}`}
        >
          {hayStock ? `En stock (${producto.stock})` : "Sin stock"}
        </div>
      </div>

      <div className="producto-content">
        <div className="producto-image-section">
          <img
            src={producto.fotos ? `/images/${producto.fotos}` : placeholder}
            alt={producto.titulo}
            className="producto-imagen"
          />
        </div>

        <div className="producto-info-section">
          <p className="producto-description">
            {producto.descripcion ||
              "Este producto no tiene descripción cargada."}
          </p>

          <div className="producto-price-section">
            <div className="producto-precio">{precioFormateado}</div>
            <div className="price-details">Impuestos incluidos</div>
          </div>

          <div className="producto-categorias">
            <span className="categoria-label">Categoría:</span>
            <div className="categoria-pills">
              <span className="categoria-pill">
                {producto.categoria || "Sin categoría"}
              </span>
            </div>
          </div>

          <div className="producto-metadata">
            <p>
              <strong>Vendedor:</strong>{" "}
              {producto.vendedor?.nombre || "Tienda Sol"}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {producto.activo ? "Publicado" : "No disponible"}
            </p>
          </div>

          <div className="comprar-container">
            <ButtonGroup variant="outlined" aria-label="cantidad de producto">
              <Button
                onClick={disminuirCantidad}
                disabled={!hayStock || cantidad <= 1}
              >
                -
              </Button>
              <Button disabled>{cantidad}</Button>
              <Button
                onClick={aumentarCantidad}
                disabled={!hayStock || cantidad >= producto.stock}
              >
                +
              </Button>
            </ButtonGroup>

            <Button
              className="comprar"
              disabled={!hayStock || cantidad === 0}
              onClick={() => agregarItem(producto, cantidad)}
            >
              Agregar al carrito
            </Button>
          </div>

          {!hayStock && (
            <p className="producto-warning">
              Este producto no tiene stock en este momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
