import React from "react";
import PropTypes from "prop-types";
import "./Paginacion.css";

const Paginacion = ({ currentPage, totalPaginas, onPageChange }) => {
  return (
    <nav className="paginacion" aria-label="Paginación de resultados">
      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={num === currentPage ? "active" : ""}
          aria-current={num === currentPage ? "page" : undefined}
          aria-label={`Ir a página ${num}`}
          aria-pressed={num === currentPage}
        >
          {num}
        </button>
      ))}
    </nav>
  );
};

Paginacion.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPaginas: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Paginacion;
