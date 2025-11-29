import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductos } from "../services/ProductosService.js";
import ProductsCarousel from "./ProductsCarousel.jsx";
import PropTypes from "prop-types";


const ProductosCategoria = ({ cantidad = 4, categoria }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        // Suponiendo que getProductos acepta filtros
        const res = await getProductos(1, { categoria: categoria });
        setProductos(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) return <p>Cargando productos de deportes...</p>;

  return (
    <ProductsCarousel productos={productos} />
)};

ProductosCategoria.propTypes = {
  cantidad: PropTypes.number,
  categoria: PropTypes.string,
};


export default ProductosCategoria;