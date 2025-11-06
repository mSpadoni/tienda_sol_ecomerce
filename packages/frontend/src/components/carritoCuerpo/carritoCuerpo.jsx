import React, {useEffect,useState} from "react";
import { useCarrito } from "../../provieder/carritoProvider";
import CarritoItem from "./CarritoItem.jsx";
import { useNavigate } from "react-router-dom";
import "./carritoCuerpo.css";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

const CarritoCuerpo = ({onClose}) => {
  const { carrito, carritoVacio,totalPrecio } = useCarrito();
  const navigate = useNavigate();
  const [total,setTotal]=useState(0)
  
  const comprar=()=>{
    onClose()
    navigate("/checkout")
  }
  
  useEffect(() => {
  setTotal(totalPrecio());
  if (carritoVacio()) {
    onClose();
  }
}, [carrito.length, totalPrecio, carritoVacio, onClose]);


  return (
    <div className="rappi-carrito">
      <h2>Carrito de compras</h2>

      <div className="rappi-items-container">
        {carrito.map(item => (
          <CarritoItem
            key={item.producto.id}
            item={item}
          />
        ))}
      </div>

      <div className="rappi-footer">
        <div className="rappi-total">
          <strong>Total: ${total.toLocaleString("es-AR")}</strong>
        </div>
        <div className="rappi-boton-comprar-container">
          <Button className="rappi-comprar-button" disable={()=>carrito.length===0} onClick={comprar}>
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarritoCuerpo;

CarritoCuerpo.propTypes = {
  onClose: PropTypes.func.isRequired,
};