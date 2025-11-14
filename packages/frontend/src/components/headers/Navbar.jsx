import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaBars, FaTimes, FaBell } from "react-icons/fa";
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
      <header className="navbar-bg" role="banner" aria-label="Navegación principal cargando">
        <nav className="navbar" aria-busy="true" role="status" aria-label="Cargando navegación">
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
              aria-hidden="true"
            />
            {!isMobile ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                  aria-hidden="true"
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                  aria-hidden="true"
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                  aria-hidden="true"
                />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                  aria-hidden="true"
                />
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={30}
                  sx={{ borderRadius: "8px" }}
                  aria-hidden="true"
                />
              </Stack>
            ) : (
              <Skeleton
                variant="rectangular"
                width={40}
                height={40}
                sx={{ borderRadius: "8px" }}
                aria-hidden="true"
              />
            )}
            <Skeleton 
              variant="circular" 
              width={40} 
              height={40}
              aria-hidden="true"
            />
          </Stack>
        </nav>
      </header>
    );
  }

  return (
    <header className="navbar-bg" role="banner">
      <nav className="navbar" aria-label="Navegación principal">
        {/* Logo */}
        <div className="navbar-left">
          <button 
            onClick={volverAHome} 
            className="logo"
            aria-label="Ir a inicio - TiendaSol.com"
          >
            TiendaSol.com
          </button>
        </div>

        {/* Menú Desktop */}
        {!isMobile && isVisible && (
          <div className="navbar-center" role="menubar" aria-label="Menú principal">
            <Link 
              to="/" 
              className="nav-link"
              role="menuitem"
              aria-label="Ir a productos"
            >
              Productos
            </Link>
            <Link 
              to="/pedidos/hechos" 
              className="nav-link"
              role="menuitem"
              aria-label="Ver mis pedidos"
            >
              Mis pedidos
            </Link>
            {elUsuarioEsUn("vendedor") && isAuthenticated && (
              <Link 
                to="/pedidos/recibidos" 
                className="nav-link"
                role="menuitem"
                aria-label="Ver pedidos recibidos"
              >
                Pedidos Recibidos
              </Link>
            )}
            
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={registrar} 
                  className="nav-button"
                  aria-label="Crear nueva cuenta"
                >
                  Sign-On
                </button>
                <button 
                  onClick={login} 
                  className="nav-button"
                  aria-label="Iniciar sesión"
                >
                  Login
                </button>
              </>
            ) : (
              <button 
                onClick={logout} 
                className="logout_button"
                aria-label="Cerrar sesión"
              >
                Logout
              </button>
            )}
          </div>
        )}

        {/* Carrito y hamburguesa */}
        <div className="navbar-right">
          {isVisible && (
            <Link
              to="/notificaciones"
              className="notification-button"
              aria-label="Ver notificaciones"
              role="button"
            >
              <FaBell aria-hidden="true" />
            </Link>
          )}
          {isVisible && (
            <button
              className="cart"
              disabled={carritoVacio()}
              onClick={toggleCarrito}
              aria-label={`Carrito de compras, ${carritoLongitud} artículos`}
              aria-expanded={carritoAbierto}
              aria-controls="carrito-drawer"
              aria-disabled={carritoVacio()}
            >
              <FaShoppingCart color="black" aria-hidden="true" />
              {carritoLongitud > 0 && (
                <span 
                  className="cart-count"
                  aria-label={`${carritoLongitud} productos en el carrito`}
                >
                  {carritoLongitud}
                </span>
              )}
            </button>
          )}
          {isMobile && isVisible && (
            <button 
              className="hamburger" 
              onClick={toggleMenu}
              aria-label={menuAbierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={menuAbierto}
              aria-controls="drawer-menu"
            >
              {menuAbierto ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            </button>
          )}
        </div>
      </nav>

      {/* Drawer Móvil */}
      {isMobile && menuAbierto && (
        <>
          <div 
            className="drawer-overlay" 
            onClick={cerrarMenu}
            aria-hidden="true"
            role="presentation"
          ></div>
          <div 
            className="drawer-menu"
            id="drawer-menu"
            role="navigation"
            aria-label="Menú de navegación móvil"
          >
            <Link 
              to="/" 
              className="nav-link"
              onClick={cerrarMenu}
              role="menuitem"
              aria-label="Ir a productos desde menú móvil"
            >
              Productos
            </Link>
            <Link
              to="/pedidos/hechos"
              className="nav-link"
              onClick={cerrarMenu}
              role="menuitem"
              aria-label="Ver mis pedidos desde menú móvil"
            >
              Mis pedidos
            </Link>
            {elUsuarioEsUn("vendedor") && isAuthenticated && (
              <Link
                to="/pedidos/recibidos"
                className="nav-link"
                onClick={cerrarMenu}
                role="menuitem"
                aria-label="Ver pedidos recibidos desde menú móvil"
              >
                Pedidos Recibidos
              </Link>
            )}
            <Link
              to="/notificaciones"
              className="nav-link"
              onClick={cerrarMenu}
              role="menuitem"
              aria-label="Ver notificaciones desde menú móvil"
            >
              Notificaciones
            </Link>

            {!isAuthenticated ? (
              <>
                <button 
                  onClick={registrar} 
                  className="nav-button"
                  aria-label="Crear nueva cuenta desde menú móvil"
                >
                  Sign-On
                </button>
                <button 
                  onClick={login} 
                  className="nav-button"
                  aria-label="Iniciar sesión desde menú móvil"
                >
                  Login
                </button>
              </>
            ) : (
              <button 
                onClick={logout} 
                className="logout_button"
                aria-label="Cerrar sesión desde menú móvil"
              >
                Logout
              </button>
            )}
          </div>
        </>
      )}

      {/* Drawer Carrito */}
      {carritoAbierto && (
        <>
          <div 
            className="drawer-overlay" 
            onClick={toggleCarrito}
            aria-hidden="true"
            role="presentation"
          ></div>
          <div 
            className="carrito-drawer izquierda abierto"
            id="carrito-drawer"
            role="dialog"
            aria-label="Panel del carrito de compras"
            aria-modal="true"
          >
            <CarritoCuerpo onClose={toggleCarrito} />
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;