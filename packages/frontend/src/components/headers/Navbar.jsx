import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CarritoCuerpo from "../carritoCuerpo/carritoCuerpo.jsx";
import { useCarrito } from "../../provieder/carritoProvider.jsx";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { useKeycloak } from "../../provieder/keyCloak.jsx";
import { useVisible } from "../../provieder/visibleHook.jsx";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import "./Navbar.css";

const Navbar = () => {
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  const { carrito, carritoVacio } = useCarrito();
  const { currency, setCurrency } = useCurrency();
  const { isAuthenticated, login, logout, elUsuarioEsUn, keycloakReady } =
    useKeycloak();
  const { isVisible, ponerInvisible, ponerVisible } = useVisible();

  const navigate = useNavigate();
  const carritoLongitud = carrito.length;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [textoMoneda, setTextoMoneda] = useState("ARS — Peso Argentino");
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (keycloakReady) {
      setShowSkeleton(false);
      return;
    }
    const timer = setTimeout(() => setShowSkeleton(false), 2000);
    return () => clearTimeout(timer);
  }, [keycloakReady]);

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
  const toggleCarrito = () => setCarritoAbierto(!carritoAbierto);
  const toggleDropdown = () => setDropdownAbierto(!dropdownAbierto);

  const seleccionarMoneda = (monedaElegida) => {
    setCurrency(monedaElegida);
    setDropdownAbierto(false);
  };

  if (showSkeleton) {
    return (
      <header className="navbar-bg">
        <nav className="navbar">
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Skeleton
              variant="rectangular"
              width={160}
              height={40}
              sx={{ borderRadius: "8px" }}
            />
            {!isMobile ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                />
              </Stack>
            ) : (
              <Skeleton
                variant="rectangular"
                width={40}
                height={40}
                sx={{ borderRadius: "8px" }}
              />
            )}
            <Skeleton variant="circular" width={40} height={40} />
          </Stack>
        </nav>
      </header>
    );
  }

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
            <Link to="/" className="nav-link">
              Productos
            </Link>
            <Link to="/pedidos/hechos" className="nav-link">
              Mis pedidos
            </Link>
            {elUsuarioEsUn("vendedor") && isAuthenticated && (
              <Link to="/pedidos/recibidos" className="nav-link">
                Pedidos Recibidos
              </Link>
            )}
            <Link to="/notificaciones" className="nav-link">
              Notificaciones
            </Link>

            {/* Moneda con SELECT en desktop */}
            {/* <select
              className="currency-select"
              value={currency}
              onChange={(e) => seleccionarMoneda(e.target.value)}
            >
              <option value="ARS">ARS — Peso Argentino</option>
              <option value="BRL">BRL — Real Brasileño</option>
              <option value="USD">USD — Dólar Estadounidense</option>
            </select> */}

            {!isAuthenticated ? (
              <>
                <button onClick={registrar} className="nav-button">
                  Sign-On
                </button>
                <button onClick={login} className="nav-button">
                  Login
                </button>
              </>
            ) : (
              <button onClick={logout} className="logout_button">
                Logout
              </button>
            )}
          </div>
        )}

        {/* Carrito y hamburguesa */}
        <div className="navbar-right">
          {isVisible && (
            <button
              className="cart"
              disabled={carritoVacio()}
              onClick={toggleCarrito}
            >
              <FaShoppingCart color="black" />
              <span className="cart-count">{carritoLongitud}</span>
            </button>
          )}
          {isMobile && isVisible && (
            <button className="hamburger" onClick={toggleMenu}>
              {menuAbierto ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>
      </nav>

      {/* Drawer Móvil */}
      {isMobile && menuAbierto && (
        <>
          <div className="drawer-overlay" onClick={cerrarMenu}></div>
          <div className="drawer-menu">
            <Link to="/" className="nav-link" onClick={cerrarMenu}>
              Productos
            </Link>
            <Link
              to="/pedidos/hechos"
              className="nav-link"
              onClick={cerrarMenu}
            >
              Mis pedidos
            </Link>
            {elUsuarioEsUn("vendedor") && isAuthenticated && (
              <Link
                to="/pedidos/recibidos"
                className="nav-link"
                onClick={cerrarMenu}
              >
                Pedidos Recibidos
              </Link>
            )}
            <Link
              to="/notificaciones"
              className="nav-link"
              onClick={cerrarMenu}
            >
              Notificaciones
            </Link>

            {/* Moneda móvil con botón + dropdown */}
            {/* <div className="currency-wrapper">
              <button className="currency-button" onClick={toggleDropdown}>
                {textoMoneda}
              </button>
              {dropdownAbierto && (
                <div className="currency-dropdown mobile">
                  <div
                    className={currency === "ARS" ? "selected" : ""}
                    onClick={() =>
                      seleccionarMoneda("ARS", "ARS — Peso Argentino")
                    }
                  >
                    ARS — Peso Argentino
                  </div>
                  <div
                    className={currency === "BRL" ? "selected" : ""}
                    onClick={() =>
                      seleccionarMoneda("BRL", "BRL — Real Brasileño")
                    }
                  >
                    BRL — Real Brasileño
                  </div>
                  <div
                    className={currency === "USD" ? "selected" : ""}
                    onClick={() =>
                      seleccionarMoneda("USD", "USD — Dólar Estadounidense")
                    }
                  >
                    USD — Dólar Estadounidense
                  </div>
                </div>
              )}
            </div> */}

            {!isAuthenticated ? (
              <>
                <button onClick={registrar} className="nav-button">
                  Sign-On
                </button>
                <button onClick={login} className="nav-button">
                  Login
                </button>
              </>
            ) : (
              <button onClick={logout} className="logout_button">
                Logout
              </button>
            )}
          </div>
        </>
      )}

      {/* Drawer Carrito */}
      {carritoAbierto && (
        <>
          <div className="drawer-overlay" onClick={toggleCarrito}></div>
          <div className="carrito-drawer izquierda abierto">
            <CarritoCuerpo onClose={toggleCarrito} />
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
