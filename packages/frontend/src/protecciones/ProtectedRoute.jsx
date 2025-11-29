import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useKeycloak } from "../provieder/keyCloak.jsx";
import { useNavigate } from "react-router-dom";
import Home from "../features/home/Home.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, keycloakReady, login } = useKeycloak();

  useEffect(() => {
    if (!keycloakReady) return; // esperar la inicialización real

    if (!isAuthenticated) {
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

  return <Outlet />;
}


