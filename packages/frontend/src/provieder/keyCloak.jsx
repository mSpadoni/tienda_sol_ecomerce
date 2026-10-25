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
import { ClipLoader } from "react-spinners";

const KeycloakContext = createContext();
export const useKeycloak = () => useContext(KeycloakContext);

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "ecommerce",
  clientId: "tp_desarrollo",
});

export let keyCloakToken = "";

export const KeycloakProvider = ({ children }) => {
  const keycloakRef = useRef(keycloak);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keycloakReady, setKeycloakReady] = useState(false);

  const refreshIntervalRef = useRef(null);

  // -----------------------
  // Helpers
  // -----------------------
  const persistSession = useCallback(() => {
    const kc = keycloakRef.current;

    if (kc.token && kc.refreshToken) {
      localStorage.setItem("kc_token", kc.token);
      localStorage.setItem("kc_refreshToken", kc.refreshToken);
      keyCloakToken = kc.token;
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("kc_token");
    localStorage.removeItem("kc_refreshToken");
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

    // Restaurar tokens
    const storedToken = localStorage.getItem("kc_token");
    const storedRefresh = localStorage.getItem("kc_refreshToken");

    if (storedToken && storedRefresh) {
      kc.token = storedToken;
      kc.refreshToken = storedRefresh;
      keyCloakToken = storedToken;
    }

    kc.init({
      onLoad: "check-sso",
      checkLoginIframe: false,
      pkceMethod: "S256",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
    })
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
  const login = useCallback(() => {
    keycloakRef.current.login({
      redirectUri: window.location.origin,
    });
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

  // -----------------------
  // LOADING
  // -----------------------
  if (!keycloakReady) {
    return (
      <div style={{ display: "flex", justifyContent: "center", height: "60vh", alignItems: "center" }}>
        <ClipLoader color="#1976d2" size={80} />
      </div>
    );
  }

  return (
    <KeycloakContext.Provider
      value={{
        isAuthenticated,
        login,
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