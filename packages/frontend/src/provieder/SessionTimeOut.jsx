import { useEffect, useRef } from "react";
import { useKeycloak } from "./keyCloak";
import PropTypes from "prop-types";

export default function SessionTimeout({ timeout = 30 * 60 * 1000 }) {
  const { logout, isAuthenticated } = useKeycloak();
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (!isAuthenticated) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      logout();
      console.log("Sesión cerrada por inactividad");
    }, timeout);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

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
