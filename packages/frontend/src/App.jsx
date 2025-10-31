import React, { useState, useEffect } from "react";
// import logger from "../../logger/logger.js";
import "./App.css";
import Home from './features/home/Home.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetailPage from './features/productos/ProductDetailPage.jsx';
import Layout from "./features/Layout/layout.jsx";
import { CarritoProvider } from "./provieder/carritoProvider.jsx";
import {CurrencyProvider} from "./provieder/CurrencyProvider.jsx";
import Checkout from "./features/Checkuot/checkout.jsx";
import ListaPedidos from "./components/Pedidos/pedido.jsx";
import Pedidos from "./components/mockData/Pedidos.js";


function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.log("Error cargando mensaje.", error));
  }, []);

  return (
    <CurrencyProvider>
    <CarritoProvider>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="/productos/:id" element={<ProductDetailPage/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/pedidos/hechos" element={<ListaPedidos estadoACambiar="cancelado" 
          pedidos={Pedidos.filter(pedido => pedido.usuario === 1)}/>} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </CarritoProvider>
    </CurrencyProvider>
  );
}

export default App;
