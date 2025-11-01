import { createContext, useContext, useEffect, useState } from "react";
import Keycloak from "keycloak-js";
import PropTypes from "prop-types";
import React from "react";

const KeycloakContext = createContext();

export const useKeycloak = () => {
  return useContext(KeycloakContext);
}

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const kc = new Keycloak({
          url: "http://localhost:8080/",
          realm: "mi-realm",
          clientId: "mi-frontend",
        });

        // Inicializar Keycloak y esperar resultado
        const auth = await kc.init({ onLoad: "login-required" });
        setKeycloak(kc);
        setAuthenticated(auth);

        if (auth) {
          const info = await kc.loadUserInfo();
          setUser(info);
        }

        // Actualizar token cada minuto si le quedan menos de 70 segundos
        setInterval(async () => {
          try {
            await kc.updateToken(70);
          } catch {
            kc.logout();
          }
        }, 60000);

      } catch (error) {
        console.error("Error inicializando Keycloak:", error);
      }
    };

    initKeycloak();
  }, []);

  const login = () => keycloak?.login();
  const logout = () => keycloak?.logout();

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, user, login, logout }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export const useKeycloakAuth = () => useContext(KeycloakContext);

KeycloakProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
