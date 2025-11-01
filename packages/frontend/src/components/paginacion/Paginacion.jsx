import React from 'react';
import PropTypes from 'prop-types';
import './Paginacion.css';

const Paginacion = ({ currentPage, totalPaginas, onPageChange }) => {
  return (
    <div className="paginacion">
      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={num === currentPage ? 'active' : ''}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

Paginacion.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPaginas: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Paginacion;