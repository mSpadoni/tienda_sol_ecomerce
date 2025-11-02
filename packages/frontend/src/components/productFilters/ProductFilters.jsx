import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiArrowRight } from 'react-icons/fi';
import './ProductFilters.css';

const ProductFilters = ({ onApply, initial = {} }) => {
  const [titulo, setTitulo] = useState(initial.titulo || '');
  const [categoria, setCategoria] = useState(initial.categoria || '');
  const [precioMin, setPrecioMin] = useState(initial.precioMin || '');
  const [precioMax, setPrecioMax] = useState(initial.precioMax || '');
  const [activo, setActivo] = useState(
    initial.activo === undefined ? '' : String(initial.activo),
  );
  const [sort, setSort] = useState(initial.sort || 'ventas');
  const [order, setOrder] = useState(initial.order || 'desc');

  const handleApply = (e) => {
    e.preventDefault();
    const filtros = {};
    if (titulo && titulo.trim() !== '') filtros.titulo = titulo.trim();
    if (categoria && categoria.trim() !== '') filtros.categoria = categoria.trim();
    if (precioMin !== '') filtros.precioMin = precioMin;
    if (precioMax !== '') filtros.precioMax = precioMax;
    if (activo !== '') filtros.activo = activo === 'true';
    if (sort) filtros.sort = sort;
    if (order) filtros.order = order;
    onApply(filtros);
  };

  const handleReset = () => {
    setTitulo('');
    setCategoria('');
    setPrecioMin('');
    setPrecioMax('');
    setActivo('');
    setSort('ventas');
    setOrder('desc');
    onApply({});
  };

  return (
    <div className="product-filters-wrapper">
      <form className="product-filters" onSubmit={handleApply}>
      <input
        placeholder="Buscar título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <input
        placeholder="Categoría"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />

      <input
        type="number"
        placeholder="Precio min"
        value={precioMin}
        onChange={(e) => setPrecioMin(e.target.value)}
      />

      <input
        type="number"
        placeholder="Precio max"
        value={precioMax}
        onChange={(e) => setPrecioMax(e.target.value)}
      />

      <select value={activo} onChange={(e) => setActivo(e.target.value)}>
        <option value="">Todos</option>
        <option value="true">Activos</option>
        <option value="false">No activos</option>
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="ventas">Ventas</option>
        <option value="precio">Precio</option>
      </select>

      <select value={order} onChange={(e) => setOrder(e.target.value)}>
        <option value="desc">Descendente</option>
        <option value="asc">Ascendente</option>
      </select>

      <button type="submit" className="btn btn-primary">
        <span>Aplicar</span>
        <FiArrowRight className="icon" />
      </button>
      <button type="button" className="btn btn-secondary" onClick={handleReset}>Limpiar</button>
      </form>
    </div>
  );
};

ProductFilters.propTypes = {
  onApply: PropTypes.func.isRequired,
  initial: PropTypes.object,
};

export default ProductFilters;

