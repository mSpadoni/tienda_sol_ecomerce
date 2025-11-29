import React, { useEffect, useState } from "react";
import ProductDetailPage from "./ProductDetailPage.jsx";
import AccomodationSearchBar from "../../components/accomodationSearchBar/AccomodationSearchBar.jsx";
import "./ProductsPage.css";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { getProductos } from "../../services/ProductosService.js";
import Paginacion from "../../components/paginacion/Paginacion.jsx";
import { Alert } from "@mui/material";
import ProductFilters from "../../components/productFilters/ProductFilters.jsx";
import { useLocation, Link } from "react-router-dom"; // <-- Agrega Link aquí

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ProductsPage = () => {
  const [productos, setProductos] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtros, setFiltros] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const query = useQuery();

  // Cargar productos cada vez que cambian los filtros o la página
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductos(currentPage, filtros);
        setProductos(res.data || []);
        setTotalPaginas(res.totalPaginas || 1);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [currentPage, filtros]);

  // Inicializar filtros si hay query param
  useEffect(() => {
    const titulo = query.get("titulo");
    if (titulo) {
      setFiltros({ titulo });
      setCurrentPage(1);
    }
    // Si no hay query param, no hace falta hacer nada, el otro useEffect se encarga
  }, []);

  // Cuando aplicás filtros desde ProductFilters
  const aplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    setCurrentPage(1); // Volver a la primera página
  };

  // Cuando hacés búsqueda desde la barra
  const filtrarPorTitulo = (searchText) => {
    setFiltros((prev) => ({
      ...prev,
      titulo: searchText && searchText.trim() !== "" ? searchText.trim() : undefined,
    }));
    setCurrentPage(1);
  };

  const aplicarFiltrosYCerrar = (nuevosFiltros) => {
    aplicarFiltros(nuevosFiltros);
    if (isMobile) setDrawerOpen(false);
  };

  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <div className="products-layout">
      <aside>
        <ProductFilters onApply={aplicarFiltros} initial={filtros} />
      </aside>

      {/* Mobile filters drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <div style={{ width: 280, padding: 16 }}>
          <ProductFilters onApply={aplicarFiltrosYCerrar} initial={filtros} />
        </div>
      </Drawer>

      <main>
        <h1 style={{ textAlign: "center" }}>Productos</h1>
        <div className="products-search">
          <AccomodationSearchBar filtrarProductos={filtrarPorTitulo} />
        </div>

        {/* Mobile filter toggle (visible only on small screens via CSS) */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12, paddingLeft: 8 }}>
            <IconButton
              aria-label="Abrir filtros"
              onClick={() => setDrawerOpen(true)}
              size="large"
            >
              <FilterListIcon />
            </IconButton>
          </div>
        )}
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <>
            <div className="products-grid">
              {productos.length === 0 ? (
                <p style={{ gridColumn: "1 / -1" }}>No se encontraron productos.</p>
              ) : (
                productos.map((producto) => {
                  const placeholder = `https://via.placeholder.com/90x90?text=${encodeURIComponent(
                    producto.titulo || "Producto"
                  )}`;
                  return (
                    <article key={producto._id || producto.id} className="product-card" style={{ marginBottom: 0 }}>
                      <div className="product-card-image">
                        <img
                          src={
                            producto.fotos
                              ? `/images/${producto.fotos}`
                              : placeholder
                          }
                          alt={producto.titulo}
                          className="producto-imagen"
                        />
                      </div>
                      <div className="product-card-body">
                        <h3 className="product-card-title">
                          {producto.titulo}
                        </h3>
                        <p className="product-card-price">
                          Precio: $
                          {producto.precio?.toLocaleString("es-AR")}
                        </p>
                      </div>
                      <div className="product-card-actions">
                        <Link
                          to={`/productos/${producto._id || producto.id}`}
                          className="product-card-link"
                        >
                          Ver detalle →
                        </Link>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {totalPaginas > 1 && (
              <div style={{ marginTop: 16 }}>
                <Paginacion
                  currentPage={currentPage}
                  totalPaginas={totalPaginas}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
