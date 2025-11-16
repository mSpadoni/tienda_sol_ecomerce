// KeycloakProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Keycloak from "keycloak-js";
import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";

const KeycloakContext = createContext();
export const useKeycloak = () => useContext(KeycloakContext);

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "ecomerce",
  clientId: "tp_desarollo",
});

export var keyCloakToken = "";

export const KeycloakProvider = ({ children }) => {
  const keycloakRef = useRef(keycloak);
  const [, forceRender] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem("kc_authenticated");
    return saved === "true"; // si existe, lo convertimos a boolean
  });

  const [keycloakReady, setKeycloakReady] = useState(false);

  const cleanUrlHash = () => {
    try {
      if (
        window.location.hash.includes("code") ||
        window.location.hash.includes("state") ||
        window.location.hash.includes("error")
      ) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    } catch (err) {
      console.error("Error al limpiar el hash de la URL:", err);
    }
  };

  const persistSession = () => {
    localStorage.setItem("kc_authenticated", "true");
    localStorage.setItem("kc_token", keycloakRef.current.token);
    localStorage.setItem("kc_refreshToken", keycloakRef.current.refreshToken);
  };

  const clearSession = () => {
    localStorage.removeItem("kc_authenticated");
    localStorage.removeItem("kc_token");
    localStorage.removeItem("kc_refreshToken");
  };

  const startTokenRefresh = () => {
    const refreshInterval = setInterval(async () => {
      if (keycloakRef.current.authenticated) {
        try {
          const refreshed = await keycloakRef.current.updateToken(60);
          if (refreshed) {
            console.log("Token refrescado");
            persistSession();
          }
        } catch (err) {
          console.error("Error al refrescar token:", err);
        }
      }
    }, 30 * 1000);

    return refreshInterval;
  };

  // --- Inicializar Keycloak
  useEffect(() => {
    cleanUrlHash();

    const storedToken = localStorage.getItem("kc_token");
    const storedRefresh = localStorage.getItem("kc_refreshToken");
    if (storedToken && storedRefresh) {
      keycloakRef.current.token = storedToken;
      keyCloakToken = storedToken;
      keycloakRef.current.refreshToken = storedRefresh;
    }

    keycloakRef.current
      .init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        pkceMethod: "S256",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setKeycloakReady(true);
        cleanUrlHash();

        if (authenticated) {
          persistSession();
          const interval = startTokenRefresh();
          return () => clearInterval(interval);
        } else {
          clearSession();
        }
      })
      .catch((err) => {
        console.error("Keycloak init error:", err);
        setKeycloakReady(true);
        cleanUrlHash();
      });
  }, []);

  const login = () => {
    try {
      keycloakRef.current.login({
        prompt: "login",
        redirectUri: window.location.href,
      });
      cleanUrlHash();
    } catch (err) {
      console.error("Error al iniciar login:", err);
    }
  };

  const logout = () => {
    try {
      clearSession();
      keycloakRef.current.logout({ redirectUri: window.location.origin });
      cleanUrlHash();
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Error al hacer logout:", err);
    }
  };

  const elUsuarioEsUn = (rol) => keycloakRef.current.hasRealmRole(rol);

  if (!keycloakReady)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <ClipLoader color="#1976d2" size={100} />
      </div>
    );

  return (
    <KeycloakContext.Provider
      value={{
        elUsuarioEsUn,
        isAuthenticated,
        login,
        logout,
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
