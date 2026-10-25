// KeycloakProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Keycloak from "keycloak-js";
import PropTypes from "prop-types";

const KeycloakContext = createContext();
export const useKeycloak = () => useContext(KeycloakContext);

const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL || "http://localhost:8080",
  realm: process.env.REACT_APP_KEYCLOAK_REALM || "ecommerce",
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "tp_desarrollo",
};

const keycloak = new Keycloak(keycloakConfig);

export let keyCloakToken = "";

const KEYCLOAK_TOKEN_URL = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;

export const KeycloakProvider = ({ children }) => {
  const keycloakRef = useRef(keycloak);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keycloakReady, setKeycloakReady] = useState(false);

  const refreshIntervalRef = useRef(null);
  const initPromiseRef = useRef(null);

  // -----------------------
  // Helpers
  // -----------------------
  const persistSession = useCallback(() => {
    const kc = keycloakRef.current;

    if (kc.token && kc.refreshToken) {
      localStorage.setItem("kc_token", kc.token);
      localStorage.setItem("kc_refreshToken", kc.refreshToken);
      if (kc.idToken) localStorage.setItem("kc_idToken", kc.idToken);
      keyCloakToken = kc.token;
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("kc_token");
    localStorage.removeItem("kc_refreshToken");
    localStorage.removeItem("kc_idToken");
    keyCloakToken = "";
  }, []);

  const startTokenRefresh = useCallback(() => {
    if (refreshIntervalRef.current) return;

    refreshIntervalRef.current = setInterval(async () => {
      try {
        const refreshed = await keycloakRef.current.updateToken(60);
        if (refreshed) {
          console.log("Token refreshed");
          persistSession();
        }
      } catch (err) {
        console.error("Token refresh error:", err);
        logout(); // si falla → logout limpio
      }
    }, 30000);
  }, [persistSession]);

  const stopTokenRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  // -----------------------
  // INIT
  // -----------------------
  useEffect(() => {
    const kc = keycloakRef.current;

    // Restaurar la sesión guardada: keycloak-js la valida con un refresh,
    // sin redirigir ni abrir el iframe de check-sso.
    const storedToken = localStorage.getItem("kc_token");
    const storedRefresh = localStorage.getItem("kc_refreshToken");
    if (storedToken) keyCloakToken = storedToken;

    if (!initPromiseRef.current) {
      initPromiseRef.current = kc.init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        pkceMethod: "S256",
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
        token: storedToken || undefined,
        refreshToken: storedRefresh || undefined,
        idToken: localStorage.getItem("kc_idToken") || undefined,
      });
    }

    initPromiseRef.current
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setKeycloakReady(true);

        if (authenticated) {
          persistSession();
          startTokenRefresh();
        } else {
          clearSession();
        }
      })
      .catch((err) => {
        console.error("Keycloak init error:", err);
        setKeycloakReady(true);
      });

    return () => {
      stopTokenRefresh();
    };
  }, [persistSession, clearSession, startTokenRefresh]);

  // -----------------------
  // AUTH ACTIONS
  // -----------------------
  const login = useCallback(async () => {
    // Si Keycloak todavía está despertando, esperamos a que termine el init.
    await initPromiseRef.current?.catch(() => {});
    keycloakRef.current.login({
      redirectUri: window.location.origin,
    });
  }, []);

  // Inicia sesión con usuario y contraseña (se usa justo después del registro).
  const loginConCredenciales = useCallback(async (username, password) => {
    const response = await fetch(KEYCLOAK_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: keycloakConfig.clientId,
        scope: "openid",
        username,
        password,
      }),
    });
    if (!response.ok) throw new Error("No se pudo iniciar sesión");

    const tokens = await response.json();
    localStorage.setItem("kc_token", tokens.access_token);
    localStorage.setItem("kc_refreshToken", tokens.refresh_token);
    if (tokens.id_token) localStorage.setItem("kc_idToken", tokens.id_token);
  }, []);

  const logout = useCallback(() => {
    stopTokenRefresh();
    clearSession();
    setIsAuthenticated(false);

    keycloakRef.current.logout({
      redirectUri: window.location.origin,
    });
  }, [clearSession]);

  const elUsuarioEsUn = (rol) =>
    keycloakRef.current.hasRealmRole(rol);

  return (
    <KeycloakContext.Provider
      value={{
        isAuthenticated,
        login,
        loginConCredenciales,
        logout,
        elUsuarioEsUn,
        keycloakReady,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  );
};

KeycloakProvider.propTypes = {
  children: PropTypes.node.isRequired,
};