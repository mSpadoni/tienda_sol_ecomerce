import React, { useState, useRef, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import CarritoCuerpo from "../carritoCuerpo/carritoCuerpo.jsx";
import { useCarrito} from "../../provieder/carritoProvider.jsx";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";

import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [moneda, setMoneda] = useState("ARS");
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const {carrito} = useCarrito();
  const carritoLongitud = carrito.length;
  const carritoRef = useRef();
  const { setCurrency } = useCurrency();


  // Cerrar carrito si clickeas fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (carritoRef.current && !carritoRef.current.contains(event.target)) {
        setCarritoAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-section left">
          <Link to="/" className="logo">TiendaSol.com</Link>
        </div>

        <div className="navbar-section center nav-links">
          <Link to="/" className="nav-link">Productos</Link>
          <Link to="/pedidos/hechos" className="nav-link">Pedidos Hechos</Link>
          <Link to="/pedidos/recibidos" className="nav-link">Pedidos Realizados</Link>
          <Link to="/notificacionesNoLeidas" className="nav-link">Notificaciones</Link>
        </div>

        <div className="navbar-section right right-section" ref={carritoRef}>
          <select value={moneda} onChange={(e) => {setMoneda(e.target.value);setCurrency(e.target.value)}} className="currency-select">
            <option value="ARS">ARS — Peso Argentino</option>
            <option value="BRL">BRL — Real Brasileño</option>
            <option value="USD">USD — Dólar Estadounidense</option>
          </select>

          <button className="cart" disabled={carritoLongitud === 0} onClick={() => setCarritoAbierto(!carritoAbierto)}>
            <FaShoppingCart color="black" />
            <span className="cart-count">{carritoLongitud}</span>
          </button>

          {carritoAbierto && (
            <div className="carrito-dropdown">
              <CarritoCuerpo />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;


