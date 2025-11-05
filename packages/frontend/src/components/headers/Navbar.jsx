import React, { useState, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
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
  const { carrito } = useCarrito();
  const carritoRef = useRef();
  const { setCurrency } = useCurrency();
  const { isAuthenticated, login, logout, elUsuarioEsUn } = useKeycloak();
  const navigate = useNavigate();
  const { isVisible, ponerInvisible, ponerVisible } = useVisible();
  const carritoLongitud = carrito.length;

  const registrar = () => {
    ponerInvisible();
    navigate("/sig-on");
  };

  const volverAHome = () => {
    navigate("/");
    ponerVisible();
  };

  return (
    <header className="navbar-bg">
      <nav className="navbar">
        {/* Sección izquierda */}
        <div className="navbar-section left">
          <button onClick={volverAHome} className="logo">
            TiendaSol.com
          </button>
        </div>

        {/* Sección central */}
        {isVisible && (
          <div className="navbar-section center nav-links">
            <Link to="/" className="nav-link">
              Productos
            </Link>
            <Link to="/pedidos/hechos" className="nav-link">
              Pedidos Hechos
            </Link>
            {elUsuarioEsUn("vendedor") && isAuthenticated && (
              <Link to="/pedidos/recibidos" className="nav-link">
                Pedidos Realizados
              </Link>
            )}
            <Link to="/notificacionesNoLeidas" className="nav-link">
              Notificaciones
            </Link>
          </div>
        )}

        {/* Sección derecha */}
        <div className="navbar-section right">
          {/* Select de moneda */}
          {isVisible && (
            <select
              value={moneda}
              onChange={(e) => {
                setMoneda(e.target.value);
                setCurrency(e.target.value);
              }}
              className="currency-select"
              ref={carritoRef}
            >
              <option value="ARS">ARS — Peso Argentino</option>
              <option value="BRL">BRL — Real Brasileño</option>
              <option value="USD">USD — Dólar Estadounidense</option>
            </select>
          )}

          {/* Botón carrito */}
          {isVisible && (
            <button
              className="cart"
              disabled={carritoLongitud === 0}
              onClick={() => setCarritoAbierto(!carritoAbierto)}
            >
              <FaShoppingCart color="black" />
              <span className="cart-count">{carritoLongitud}</span>
            </button>
          )}

          {/* Dropdown carrito */}
          {carritoAbierto && (
            <div className="carrito-dropdown">
              <CarritoCuerpo />
            </div>
          )}
        </div>

        {/* Botones login/logout */}
        <div className="navbar_button_section">
          {!isAuthenticated ? (
            <>
              {isVisible && (
                <div className="loggin_button_section">
                  <div className="sigOn_button_containe">
                    <button onClick={registrar} className="sigon_button">
                      Sig-On
                    </button>
                  </div>
                  <div className="login_button_container">
                    <button onClick={login} className="loggin_button">
                      Login
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button onClick={logout} className="logout_button">
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
