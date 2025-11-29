import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductsCarousel from "../../components/ProductsCarousel.jsx";
import { getProductos } from "../../services/ProductosService.js";
import "./Home.css";
import SuccessSnackbar from "../../components/snackBar.jsx";
import { useKeycloak } from "../../provieder/keyCloak.jsx";
import { DotLoader } from "react-spinners";
import { Alert, Divider } from "@mui/material";
import ProductosCategoria from "../../components/ProductosCategoria.jsx";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ready } = useKeycloak();
  const navigate = useNavigate();
  

  const cargarProductos = async (page = 1) => {
    const productosCargados = await getProductos(page);
    setProductos(productosCargados.data || []);
    setProductosFiltrados(productosCargados.data || []);
  };

  

  useEffect(() => {
    const cargar = async () => {
      try {
        await cargarProductos();
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    cargar();
    return undefined;
  }, []);

  const filtrarProductos = (searchText) => {
    const q = searchText && searchText.trim() !== "" ? `?titulo=${encodeURIComponent(searchText.trim())}` : "";
    navigate(`/productos${q}`);
  };

  if (error) {
    return (
      <Alert severity="error" className="alert-error">
        {error.message}
      </Alert>
    );
  }

  return (
    <div className="home-page">
      <SuccessSnackbar />

      {/* HERO */}
      <header className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">Encontrá tu próximo producto</h1>
          <p className="hero-subtitle">
            Ofertas, básicos y lo último que se cargó en la tienda.
          </p>
          {/* search moved to Products page */}
        </div>
      </header>


      {/* LAYOUT PRINCIPAL */}
      <div className="home-layout">

        {/* Backdrop for mobile when filters open */}
        

        {/* CONTENIDO PRINCIPAL */}
        <main className="home-main">
          {loading ? (
            <div className="spinner">
              <DotLoader color="#1976d2" size={50} />
              <p>Cargando productos...</p>
            </div>
          ) : (
            <>
              <section className="home-section">
                <h1>Lo mas vendido</h1>
                <ProductsCarousel productos={productosFiltrados} />
              </section>

              <section className="home-section">

                <section className="categorias-section">
                  <h2>Lo mas vendido en Deportes</h2>
                  <ProductosCategoria cantidad={4} categoria = "Deportes"/>
                  <h2>Lo mas vendido en Indumentaria</h2>
                  <ProductosCategoria cantidad={4} categoria = "Ropa"/>

                </section>
                <p>
                  Para ver el listado completo, aplicar filtros y navegar por los
                  productos en detalle, visitá la página de productos.
                </p>

                <div style={{ marginTop: 12 }}>
                  <Link to="/productos" className="primary-link">
                    <button className="primary-button">Ver todos los productos</button>
                  </Link>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;