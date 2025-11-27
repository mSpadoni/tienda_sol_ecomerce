import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccomodationSearchBar from "../../components/accomodationSearchBar/AccomodationSearchBar.jsx";
import ProductsCarousel from "../../components/ProductsCarousel.jsx";
import { getProductos } from "../../services/ProductosService.js";
import Paginacion from "../../components/paginacion/Paginacion.jsx";
import ProductFilters from "../../components/productFilters/ProductFilters.jsx";
import "./Home.css";
import SuccessSnackbar from "../../components/snackBar.jsx";
import { useKeycloak } from "../../provieder/keyCloak.jsx";
import { DotLoader } from "react-spinners";
// no icon imports for sidebar toggle
import { Alert } from "@mui/material";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { CURRENCIES } from "../../provieder/currencies.js";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ready } = useKeycloak();
  

  const cargarProductos = async (page = 1, filtrosAEnviar = filtros) => {
    const productosCargados = await getProductos(page, filtrosAEnviar);
    setProductos(productosCargados.data);
    setProductosFiltrados(productosCargados.data);
    setCurrentPage(page);
    setTotalPaginas(productosCargados.totalPaginas);
  };

  

  useEffect(() => {
    const cargar = async () => {
      try {
        await cargarProductos();
        //await new Promise((resolve) => setTimeout(resolve, 10000));
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    };

    cargar();
    return undefined;
  }, []);

  // TODO: esto debería estar en el back
  const filtrarProductos = async (searchText) => {
    const newFiltros = { ...filtros };
    if (!searchText || searchText.trim() === "") {
      delete newFiltros.titulo;
    } else {
      newFiltros.titulo = searchText.trim();
    }
    setFiltros(newFiltros);
    await cargarProductos(1, newFiltros);
  };

  const aplicarFiltros = async (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    await cargarProductos(1, nuevosFiltros);
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
          <div className="hero-search">
            <AccomodationSearchBar filtrarProductos={filtrarProductos} />
          </div>
        </div>
      </header>


      {/* LAYOUT PRINCIPAL */}
      <div className="home-layout">
        {/* SIDEBAR FIJO */}
        <aside className="sidebar-wrapper">
          <div className="filters-sidebar">
          <ProductFilters onApply={aplicarFiltros} initial={filtros} />
          </div>
        </aside>

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
                <ProductsCarousel productos={productosFiltrados} />
              </section>

              <section className="home-section">
                <div className="section-header between">
                  <h2>Todos los productos</h2>
                  <p className="section-subtitle small">
                    {productosFiltrados.length} productos encontrados
                  </p>
                </div>

                <div className="products-grid">
                  {productosFiltrados.map((producto) => {
                    const placeholder = `https://via.placeholder.com/90x90?text=${encodeURIComponent(
                      producto.titulo || "Producto"
                    )}`;

                    return (
                      <article key={producto._id} className="product-card">
                        <div className="product-card-image">
                          <img
                            src={
                              producto.fotos
                                ? `/images/${producto.fotos}`
                                : placeholder
                            }
                            alt={producto.titulo}
                          />
                        </div>
                        <div className="product-card-body">
                          <h3>{producto.titulo}</h3>
                          <p>
                            Precio: ${producto.precio?.toLocaleString("es-AR")}
                          </p>
                        </div>
                        <Link
                          to={`/productos/${producto._id}`}
                          className="product-card-link"
                        >
                          Ver detalle →
                        </Link>
                      </article>
                    );
                  })}
                </div>

                {totalPaginas >= 1 && (
                  <div className="pagination-wrapper">
                    <Paginacion
                      currentPage={currentPage}
                      totalPaginas={totalPaginas}
                      onPageChange={(page) => cargarProductos(page)}
                    />
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;