import React, { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { useKeycloak } from "../provieder/keyCloak.jsx";

export default function ProtectedRoute({ rol }) {
  const { isAuthenticated, keycloakReady, login, elUsuarioEsUn } = useKeycloak();
  const loginTriggeredRef = useRef(false);

  useEffect(() => {
    if (!keycloakReady) return; // esperar la inicialización real

    if (isAuthenticated) {
      loginTriggeredRef.current = false;
      return;
    }

    // If we are in OIDC callback hash processing, avoid retriggering login.
    const hash = window.location.hash || "";
    if (
      hash.includes("code=") ||
      hash.includes("state=") ||
      hash.includes("error=")
    ) {
      return;
    }

    if (!loginTriggeredRef.current) {
      loginTriggeredRef.current = true;
      login(); // solo llamar login después de init
    }
  }, [keycloakReady, isAuthenticated, login]);

  if (!keycloakReady) {
    return null; // no mostrar nada hasta que keycloak esté OK
  }

  if (!isAuthenticated) {
    // login ya se disparó en el effect, NO debemos mostrar nada más
    return null;
  }

  // Logueado pero sin el rol que pide la ruta (ej. un comprador en "Pedidos recibidos")
  if (rol && !elUsuarioEsUn(rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

ProtectedRoute.propTypes = {
  rol: PropTypes.string,
};


