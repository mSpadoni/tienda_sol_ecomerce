import React, { useEffect } from "react";
import { useState } from "react";
import AccomodationSearchBar from "../../components/accomodationSearchBar/AccomodationSearchBar.jsx";
import ProductsCarousel from "../../components/ProductsCarousel.jsx";
import './Home.css'
import {Spinner} from "react-bootstrap";
import { getProductos } from "../../services/ProductosService.js";
import Paginacion from "../../components/paginacion/Paginacion.jsx";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const cargarProductos = async (page=1) => {
    const productosCargados = await getProductos(page);
    setProductos(productosCargados.data);
    setProductosFiltrados(productosCargados.data);
    setCurrentPage(page);
    setTotalPaginas(productosCargados.totalPaginas);
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  //TODO: esto deberia estar en el back
  const filtrarProductos = (searchText) => {
    if(searchText.trim() === "") {
      setProductosFiltrados(productos);
    } else {
      const filtered = productos.filter(producto =>
        producto.titulo.toLowerCase().includes(searchText.toLowerCase())
      );
      setProductosFiltrados(filtered);
    }
  }

  console.log("Home component productosFiltrados:", productosFiltrados);
    return (
      <>
      <div className="home-body">
        <AccomodationSearchBar filtrarProductos={filtrarProductos}></AccomodationSearchBar>
      </div>

      {productos.length === 0 ? (
        <div className="spinner">
          <Spinner animation="border" />
        </div>
      ) : (
        <div>
          <ProductsCarousel productos={productosFiltrados} />

          {totalPaginas >= 1 && (
            <Paginacion
              currentPage={currentPage}
              totalPaginas={totalPaginas}
              onPageChange={(page) => cargarProductos(page)}
           />
          )}
        </div>
      )}
      </>
    )
};

export default Home; 