import React from "react";
import { useCarrito} from "../../provieder/carritoProvider";
import CarritoItem from "./CarritoItem.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./carritoCuerpo.css";

const CarritoCuerpo = () => {
  const {carrito,eliminarDelCarrito } = useCarrito();
  const navigate = useNavigate()


  const total = carrito.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

  return (
    <div className="rappi-carrito">
      <h2>Carrito de compras</h2>

      {carrito.map(item => (
        <CarritoItem
          key={item.producto.id}
          item={item}
          onEliminarCantidad={eliminarDelCarrito}
        />
      ))}

      <div className="rappi-total">
        <strong>Total: ${total.toLocaleString("es-AR")}</strong>
      </div>
      <div className="rappi-boton-comprar-container">
        <button className="rappi-comprar-button" onClick={()=>navigate("/checkout")}>Comprar</button>
      </div>
    </div>
  );
};

export default CarritoCuerpo;