import { useEffect, useRef } from "react";
import { useKeycloak } from "./keyCloak";
import PropTypes from "prop-types";

export default function SessionTimeout({ timeout = 30 * 60 * 1000 }) {
  const { logout, isAuthenticated } = useKeycloak();
  const timerRef = useRef(null);

  // Función que resetea el timer
  const resetTimer = () => {
    if (!isAuthenticated) return; // si no está logueado, no hace nada
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      // solo hace logout si el usuario sigue logueado
      
        logout();
        console.log("Sesión cerrada por inactividad");
      
    }, timeout);
  };

  useEffect(() => {
    if (!isAuthenticated) return; // solo activa si está logueado

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer(); // iniciar timer al montar

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, timeout, logout]);

  return null;
}

SessionTimeout.propTypes = {
  timeout: PropTypes.number,
};
