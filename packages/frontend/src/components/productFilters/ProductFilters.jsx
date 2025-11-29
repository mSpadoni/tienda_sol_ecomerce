import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ProductFilters.css";

const ProductFilters = ({ onApply, initial = {} }) => {
  const [titulo, setTitulo] = useState(initial.titulo || "");
  const [categoria, setCategoria] = useState(initial.categoria || "");
  const [precioMin, setPrecioMin] = useState(initial.precioMin || "");
  const [precioMax, setPrecioMax] = useState(initial.precioMax || "");
  const [activo, setActivo] = useState(
    initial.activo === undefined ? "" : String(initial.activo),
  );
  const [sort, setSort] = useState(initial.sort || "");
  const [order, setOrder] = useState(initial.order || "");

  const handleApply = (e) => {
    e.preventDefault();
    const filtros = {};
    if (titulo && titulo.trim() !== "") filtros.titulo = titulo.trim();
    // Treat empty and 'todas' as no category filter
    if (categoria && categoria.trim() !== "" && categoria !== "todas")
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
    setSort("");
    setOrder("");
    onApply({});
  };

  return (
    <div className="product-filters-wrapper">
      <div className="filters-header">
        <h3>Filtros de productos</h3>
      </div>
      <form
        className="product-filters"
        onSubmit={handleApply}
        aria-label="Filtros de búsqueda de productos"
        role="search"
      >
        <fieldset>

          <div className="input-wrapper">
            <select
              id="categoria-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              aria-label="Filtrar por categoría"
            >
              <option value="" disabled>
                Categorías
              </option>
              <option value="todas">Todas</option>
              <option value="deportes">Deportes</option>
              <option value="electronica">Electrónica</option>
              <option value="indumentaria">Indumentaria</option>
            </select>
          </div>

          <div className="input-row">
            <div className="input-wrapper small">
              <input
                type="number"
                placeholder="Precio min"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                aria-label="Precio mínimo"
              />
            </div>

            <div className="input-wrapper small">
              <input
                type="number"
                placeholder="Precio max"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                aria-label="Precio máximo"
              />
            </div>
          </div>  

          <div className="input-wrapper">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Ordenar por"
            >
              <option value="" disabled>
                Ordenar por
              </option>
              <option value="ventas">Ventas</option>
              <option value="precio">Precio</option>
            </select>
          </div>

          <div className="input-wrapper">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              aria-label="Orden ascendente o descendente"
            >
              <option value="" disabled>
                Orden
              </option>
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </fieldset>

        <div className="button-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            aria-label="Limpiar todos los filtros"
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="btn btn-primary contained"
            aria-label="Aplicar filtros de búsqueda"
          >
            Aplicar
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
