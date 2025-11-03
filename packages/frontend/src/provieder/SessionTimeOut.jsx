// import { useEffect, useRef } from "react";
// //import { useKeycloak } from "./keyCloak";
// import react from "react";
// import PropTypes from "prop-types";

// export default function SessionTimeout({ timeout = 30 * 60 * 1000 }) {
//   // timeout en ms, ej: 30 minutos
//   const { logout } = useKeycloak();
//   const timerRef = useRef(null);

//   // Función que resetea el timer
//   const resetTimer = () => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     timerRef.current = setTimeout(() => {
//       logout(); // cierra sesión al expirar el timeout
//     }, timeout);
//   };

//   useEffect(() => {
//     // eventos que consideramos actividad del usuario
//     const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

//     events.forEach(e => window.addEventListener(e, resetTimer));

//     // iniciar timer al montar
//     resetTimer();

//     return () => {
//       events.forEach(e => window.removeEventListener(e, resetTimer));
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, []);

//   return null; // este componente no renderiza nada
// }

// SessionTimeout.propTypes = {
//   timeout: PropTypes.number,
// };
