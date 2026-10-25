import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useKeycloak } from "../provieder/keyCloak.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, keycloakReady, login } = useKeycloak();
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

  return <Outlet />;
}


