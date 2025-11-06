import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CarritoCuerpo from "../carritoCuerpo/carritoCuerpo.jsx";
import { useCarrito } from "../../provieder/carritoProvider.jsx";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { useKeycloak } from "../../provieder/keyCloak.jsx";
import { useVisible } from "../../provieder/visibleHook.jsx";

import "./Navbar.css";

const Navbar = () => {
  const [moneda, setMoneda] = useState("ARS");
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { carrito,carritoVacio } = useCarrito();
  const { setCurrency } = useCurrency();
  const { isAuthenticated, login, logout, elUsuarioEsUn } = useKeycloak();
  const navigate = useNavigate();
  const { isVisible, ponerInvisible, ponerVisible } = useVisible();
  const carritoLongitud = carrito.length;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const registrar = () => {
    ponerInvisible();
    navigate("/sig-on");
    setMenuAbierto(false);
  };

  const volverAHome = () => {
    navigate("/");
    ponerVisible();
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);
  const cerrarCarrito = () => setCarritoAbierto(false);

  return (
    <header className="navbar-bg">
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-left">
          <button onClick={volverAHome} className="logo">
            TiendaSol.com
          </button>
        </div>

        {/* Menú Desktop */}
        {!isMobile && isVisible && (
          <div className="navbar-center">
            <Link to="/" className="nav-link">Productos</Link>
            <Link to="/pedidos/hechos" className="nav-link">Pedidos Hechos</Link>
            {elUsuarioEsUn("vendedor") && isAuthenticated && (
              <Link to="/pedidos/recibidos" className="nav-link">Pedidos Recibidos</Link>
            )}
            <Link to="/notificaciones" className="nav-link">Notificaciones</Link>

            <select
              value={moneda}
              onChange={(e) => {
                setMoneda(e.target.value);
                setCurrency(e.target.value);
              }}
              className="currency-select"
            >
              <option value="ARS">ARS — Peso Argentino</option>
              <option value="BRL">BRL — Real Brasileño</option>
              <option value="USD">USD — Dólar Estadounidense</option>
            </select>

            {!isAuthenticated ? (
              <>
                <button onClick={registrar} className="nav-button sigon">Sig-On</button>
                <button onClick={login} className="nav-button login">Login</button>
              </>
            ) : (
              <button onClick={logout} className="logout_button">Logout</button>
            )}
          </div>
        )}

        {/* Carrito y hamburguesa */}
        <div className="navbar-right">
          {isMobile && (
            <button className="hamburger" onClick={toggleMenu}>
              {menuAbierto ? <FaTimes /> : <FaBars />}
            </button>
          )}
          <button
            className="cart"
            disabled={carritoVacio()}
            onClick={() => setCarritoAbierto(!carritoAbierto)}
          >
            <FaShoppingCart color="black" />
            <span className="cart-count">{carritoLongitud}</span>
          </button>
        </div>
      </nav>

      {/* Drawer Móvil */}
      {isMobile && menuAbierto && isVisible && (
        <>
          <div className="drawer-overlay" onClick={cerrarMenu}></div>
          <div className="drawer-menu">
            <Link to="/" className="nav-link" onClick={cerrarMenu}>Productos</Link>
            <Link to="/pedidos/hechos" className="nav-link" onClick={cerrarMenu}>Pedidos Hechos</Link>
            {elUsuarioEsUn("vendedor") && isAuthenticated && (
              <Link to="/pedidos/recibidos" className="nav-link" onClick={cerrarMenu}>Pedidos Recibidos</Link>
            )}
            <Link to="/notificaciones" className="nav-link" onClick={cerrarMenu}>Notificaciones</Link>

            <select
              value={moneda}
              onChange={(e) => {
                setMoneda(e.target.value);
                setCurrency(e.target.value);
              }}
              className="currency-select"
            >
              <option value="ARS">ARS — Peso Argentino</option>
              <option value="BRL">BRL — Real Brasileño</option>
              <option value="USD">USD — Dólar Estadounidense</option>
            </select>

            {!isAuthenticated ? (
              <>
                <button onClick={registrar} className="nav-button sigon">Sig-On</button>
                <button onClick={login} className="nav-button login">Login</button>
              </>
            ) : (
              <button onClick={logout} className="logout_button">Logout</button>
            )}
          </div>
        </>
      )}

      {/* Drawer Carrito desde la izquierda */}
      {carritoAbierto && (
        <>
          <div  onClick={cerrarCarrito}></div>
          <div >
            <CarritoCuerpo onClose={cerrarCarrito}/>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;




