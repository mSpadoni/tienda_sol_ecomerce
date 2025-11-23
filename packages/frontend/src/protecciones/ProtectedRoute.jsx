import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useKeycloak } from "../provieder/keyCloak.jsx";
import { useNavigate } from "react-router-dom";
import Home from "../features/home/Home.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, keycloakReady, login } = useKeycloak();
  const navigate = useNavigate();

  // --- Hook siempre llamado
  useEffect(() => {
    // Esperar a que Keycloak esté listo para decidir si redirigir al login.
    if (!keycloakReady) return;
    if (!isAuthenticated) {
      login(); // solo se ejecuta si no está autenticado
    }
  }, [isAuthenticated, login]);

  // Si no está autenticado, no renderizamos aún las rutas hijas
  return !isAuthenticated ? <Home /> : <Outlet />;
  // Está autenticado -> renderiza las rutas hijas
}
