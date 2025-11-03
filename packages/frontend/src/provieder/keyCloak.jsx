// KeycloakProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Keycloak from "keycloak-js";
import PropTypes from "prop-types";

// --- Contexto
const KeycloakContext = createContext();
export const useKeycloak = () => useContext(KeycloakContext);

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "ecomerce",
  clientId: "tp_desarollo",
});

// --- Provider
export const KeycloakProvider = ({ children }) => {
  const keycloakRef = useRef(keycloak);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keycloakReady, setKeycloakReady] = useState(false);

  // --- Función para limpiar #state, #code y #error del URL
  const cleanUrlHash = () => {
    try {
      if (
        window.location.hash.includes("code") ||
        window.location.hash.includes("state") ||
        window.location.hash.includes("error")
      ) {
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log("URL limpia de #state, #code y #error");
      }
    } catch (err) {
      console.error("Error al limpiar el hash de la URL:", err);
    }
  };

  

  // --- Inicializar Keycloak
  useEffect(() => {
    cleanUrlHash();
  
    keycloakRef.current
      .init({
        onLoad: "check-sso", // solo revisa sesión existente
        checkLoginIframe: false,
        pkceMethod: "S256",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setKeycloakReady(true);
        cleanUrlHash(); // limpiar hash después de init
      })
      .catch((err) => {
        console.error("Keycloak init error:", err);
        setKeycloakReady(true);
        cleanUrlHash(); // limpiar hash incluso si hay error
      });
  }, []);

  const login = () => {
    try {
      keycloakRef.current.login({
        redirectUri: window.location.origin,
      });
      cleanUrlHash();
    } catch (err) {
      console.error("Error al iniciar login:", err);
    }
  };

  const logout = () => {
    try {
      keycloakRef.current.logout({
        redirectUri: window.location.origin,

      });
      cleanUrlHash();
    } catch (err) {
      console.error("Error al hacer logout:", err);

    }
  };

  if (!keycloakReady) return <div>Cargando autenticación...</div>;

  return (
    <KeycloakContext.Provider value={{ keycloak: keycloakRef.current, isAuthenticated, login, logout }}>
      {children}
    </KeycloakContext.Provider>
  );
};

KeycloakProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
