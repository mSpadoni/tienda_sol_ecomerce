import React, { useState } from "react";
import PropTypes from "prop-types";
// import arrow icon removed - button will be text-only
import "./ProductFilters.css";

const ProductFilters = ({ onApply, initial = {} }) => {
  const [titulo, setTitulo] = useState(initial.titulo || "");
  const [categoria, setCategoria] = useState(initial.categoria || "");
  const [precioMin, setPrecioMin] = useState(initial.precioMin || "");
  const [precioMax, setPrecioMax] = useState(initial.precioMax || "");
  const [activo, setActivo] = useState(
    initial.activo === undefined ? "" : String(initial.activo),
  );
  const [sort, setSort] = useState(initial.sort || "ventas");
  const [order, setOrder] = useState(initial.order || "desc");

  const handleApply = (e) => {
    e.preventDefault();
    const filtros = {};
    if (titulo && titulo.trim() !== "") filtros.titulo = titulo.trim();
    if (categoria && categoria.trim() !== "")
      filtros.categoria = categoria.trim();
    if (precioMin !== "") filtros.precioMin = precioMin;
    if (precioMax !== "") filtros.precioMax = precioMax;
    if (activo !== "") filtros.activo = activo === "true";
    if (sort) filtros.sort = sort;
    if (order) filtros.order = order;
    onApply(filtros);
  };

  const handleReset = () => {
    setTitulo("");
    setCategoria("");
    setPrecioMin("");
    setPrecioMax("");
    setActivo("");
    setSort("ventas");
    setOrder("desc");
    onApply({});
  };

  return (
    <div className="product-filters-wrapper">
      <form 
        className="product-filters" 
        onSubmit={handleApply}
        aria-label="Filtros de búsqueda de productos"
        role="search"
      >
        <fieldset>
          <legend className="sr-only">Filtros de productos</legend>

          <input
            placeholder="Buscar título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            aria-label="Buscar por título del producto"
          />

          <input
            placeholder="Categoría"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-label="Filtrar por categoría"
          />

          <input
            type="number"
            placeholder="Precio min"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            aria-label="Precio mínimo"
          />

          <input
            type="number"
            placeholder="Precio max"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            aria-label="Precio máximo"
          />

          <select 
            value={activo} 
            onChange={(e) => setActivo(e.target.value)}
            aria-label="Filtrar por estado del producto"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">No activos</option>
          </select>

          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            aria-label="Ordenar por"
          >
            <option value="ventas">Ventas</option>
            <option value="precio">Precio</option>
          </select>

          <select 
            value={order} 
            onChange={(e) => setOrder(e.target.value)}
            aria-label="Orden ascendente o descendente"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </fieldset>

        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary contained"
            aria-label="Aplicar filtros de búsqueda"
          >
            Aplicar
          </button>
          <button
            type="button"
            className="btn btn-secondary outlined"
            onClick={handleReset}
            aria-label="Limpiar todos los filtros"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

ProductFilters.propTypes = {
  onApply: PropTypes.func.isRequired,
  initial: PropTypes.object,
};

export default ProductFilters;