import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "../../provieder/keyCloak.jsx";
import { useVisible } from "../../provieder/visibleHook.jsx";
import NavbarDetalle from "./navBarDetalle.jsx";
import AuthMenu from "./AuthMenuDesktop.jsx";
import CarritoIcono from "./carritoIcono.jsx";
import NotificationButton from "./NotificationButton.jsx";
import MobileDrawer from "./MobileDrawer.jsx";
import { useOutsideClick } from "../../hooks/useOutsideClick.js";
import { useResponsive } from "../../hooks/useResponsive.js";
import { IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import "./Navbar.css";

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [authMenuOpenMobile, setAuthMenuOpenMobile] = useState(false);

  const { isAuthenticated, login, logout } = useKeycloak();
  const { isVisible, ponerInvisible, ponerVisible } = useVisible();

  const navigate = useNavigate();
  const isMobile = useResponsive(900);
  const authRef = useOutsideClick(() => setAuthMenuOpen(false));
  const authRefMobile = useOutsideClick(() => setAuthMenuOpenMobile(false));

  const registrar = () => {
    ponerInvisible();
    navigate("/registro");
    setMenuAbierto(false);
  };

  const volverAHome = () => {
    navigate("/");
    ponerVisible();
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);
  const toggleAuthMenu = () => setAuthMenuOpen((s) => !s);
  const toggleAuthMenuMobile = () => setAuthMenuOpenMobile((s) => !s);

  return (
    <header className="navbar-bg" role="banner">
      <nav className="navbar" aria-label="Navegación principal">
        {/* Logo */}
        <div className="navbar-left">
          <IconButton
            onClick={volverAHome}
            className="logo"
            aria-label="Ir a inicio - TiendaSol"
            sx={{ fontSize: "1.5rem" }}
          >
            TiendaSol
          </IconButton>
        </div>

        {/* Menú Desktop */}
        {!isMobile && <NavbarDetalle />}

        {/* Carrito y hamburguesa */}
        <div className="navbar-right">
          {isVisible && <NotificationButton />}

          <CarritoIcono />

          {isMobile && isVisible && (
            <IconButton
              onClick={toggleMenu}
              aria-label={
                menuAbierto
                  ? "Cerrar menú de navegación"
                  : "Abrir menú de navegación"
              }
              aria-expanded={menuAbierto}
              aria-controls="drawer-menu"
              size="large"
            >
              {menuAbierto ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}

          {/* Auth menu for desktop */}
          {!isMobile && isVisible && (
            <AuthMenu
              authRef={authRef}
              isAuthenticated={isAuthenticated}
              onRegistrar={() => {
                registrar();
                setAuthMenuOpen(false);
              }}
              onLogin={() => {
                login();
                setAuthMenuOpen(false);
              }}
              onLogout={() => {
                logout();
                setAuthMenuOpen(false);
              }}
            >
              <MoreVertIcon
                sx={{
                  color: "#fff",
                  fontSize: 32,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.5)",
                  },
                }}
              />
            </AuthMenu>
          )}
        </div>
      </nav>

      {/* Mobile Drawer with Auth Options */}
      <MobileDrawer
        isOpen={isMobile && menuAbierto}
        onClose={cerrarMenu}
        id="drawer-menu"
        ariaLabel="Menú de navegación móvil"
      >
        {isAuthenticated ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
            <NavbarDetalle />
            <div
              className="drawer-link"
              role="button"
              tabIndex={0}
              onClick={() => {
                logout();
                cerrarMenu();
              }}
              onKeyPress={() => {
                logout();
                cerrarMenu();
              }}
            >
              Cerrar sesión
            </div>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
            <div
              className="drawer-link"
              role="button"
              tabIndex={0}
              onClick={() => {
                registrar();
                cerrarMenu();
              }}
              onKeyPress={() => {
                registrar();
                cerrarMenu();
              }}
            >
              Creá tu cuenta
            </div>
            <div
              className="drawer-link"
              role="button"
              tabIndex={0}
              onClick={() => {
                login();
                cerrarMenu();
              }}
              onKeyPress={() => {
                login();
                cerrarMenu();
              }}
            >
              Ingresá
            </div>
          </Box>
        )}
      </MobileDrawer>
    </header>
  );
};

export default Navbar;
