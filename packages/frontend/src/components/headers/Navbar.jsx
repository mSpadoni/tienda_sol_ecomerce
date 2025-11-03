import React, { useState, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import CarritoCuerpo from "../carritoCuerpo/carritoCuerpo.jsx";
import { useCarrito } from "../../provieder/carritoProvider.jsx";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { useKeycloak } from "../../provieder/keyCloak.jsx";

import "./Navbar.css";

const Navbar = () => {
  const [moneda, setMoneda] = useState("ARS");
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const { carrito } = useCarrito();
  const carritoRef = useRef();
  const { setCurrency } = useCurrency();
  const {isAuthenticated, login, logout }=useKeycloak()


  const carritoLongitud = carrito.length;


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

        <div className="navbar-section right" ref={carritoRef}>
          <select
            value={moneda}
            onChange={(e) => { setMoneda(e.target.value); setCurrency(e.target.value); }}
            className="currency-select"
          >
            <option value="ARS">ARS — Peso Argentino</option>
            <option value="BRL">BRL — Real Brasileño</option>
            <option value="USD">USD — Dólar Estadounidense</option>
          </select>

          <div>
      {!isAuthenticated ? (
        <button onClick={login}>Login</button>
      ) : (
        <button onClick={logout}>Logout</button>
       )}
     </div>

          <button
            className="cart"
            disabled={carritoLongitud === 0}
            onClick={() => setCarritoAbierto(!carritoAbierto)}
          >
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

