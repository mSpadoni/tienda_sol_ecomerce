import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKeycloak } from "../../provieder/keyCloak.jsx";
import { useVisible } from "../../provieder/visibleHook.jsx";

const NavbarDetalle = () => {
  const { isAuthenticated, elUsuarioEsUn } = useKeycloak();
  const { isVisible } = useVisible();

  return (
    <>
      {isAuthenticated && isVisible && (
        <div
          className="navbar-center"
          role="menubar"
          aria-label="Menú principal"
        >
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
          
            <Link
              to="/pedidos/recibidos"
              className="nav-link"
              role="menuitem"
              aria-label="Ver pedidos recibidos"
            >
              Pedidos Recibidos
            </Link>
        </div>
      )}
    </>
  );
};

export default NavbarDetalle;
