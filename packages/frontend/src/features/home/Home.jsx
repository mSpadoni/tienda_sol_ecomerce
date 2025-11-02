import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccomodationSearchBar from "../../components/accomodationSearchBar/AccomodationSearchBar.jsx";
import ProductsCarousel from "../../components/ProductsCarousel.jsx";
import { Spinner } from "react-bootstrap";
import { getProductos } from "../../services/ProductosService.js";
import Paginacion from "../../components/paginacion/Paginacion.jsx";
import ProductFilters from "../../components/productFilters/ProductFilters.jsx";
import "./Home.css";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);

  const cargarProductos = async (page = 1, filtrosAEnviar = filtros) => {
    setLoading(true);
    const productosCargados = await getProductos(page, filtrosAEnviar);
    setProductos(productosCargados.data);
    setProductosFiltrados(productosCargados.data);
    setCurrentPage(page);
    setTotalPaginas(productosCargados.totalPaginas);
    setLoading(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // TODO: esto debería estar en el back
  const filtrarProductos = (searchText) => {
    const newFiltros = { ...filtros };
    if (!searchText || searchText.trim() === "") {
      delete newFiltros.titulo;
    } else {
      newFiltros.titulo = searchText.trim();
    }
    setFiltros(newFiltros);
    cargarProductos(1, newFiltros);
  };

  const aplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    cargarProductos(1, nuevosFiltros);
  };

  return (
    <div className="home-page">
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

      <main className="home-main">
        {loading ? (
          <div className="spinner">
            <Spinner animation="border" />
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

                <ProductFilters onApply={aplicarFiltros} initial={filtros} />

              <div className="products-grid">
                {productosFiltrados.map((producto) => {
                  const placeholder = `https://via.placeholder.com/90x90?text=${encodeURIComponent(
                    producto.titulo || "Producto"
                  )}`;
                  return (
                    <article key={producto._id} className="product-card">
                      <div className="product-card-image">
                        <img
            src={producto.fotos ? `/images/${producto.fotos}` : placeholder}
            alt={producto.titulo}
          className="producto-imagen"
          />
                      </div>
                      <div className="product-card-body">
                        <h3 className="product-card-title">
                          {producto.titulo}
                        </h3>
                        <p className="product-card-price">
                          Precio: ${producto.precio?.toLocaleString("es-AR")}
                        </p>
                        <div className="product-card-categorias">
                          <span className="categoria-label">Categorías:</span>
                          <span className="categoria-pill">
                            {producto.categoria || "Sin categoría"}
                          </span>
                        </div>
                      </div>
                      <div className="product-card-actions">
                        <Link to={`/productos/${producto._id}`} className="product-card-link">
                          Ver detalle →
                        </Link>
                      </div>
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
  );
};

export default Home;
