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

import Store from "./components/mockData/Pedidos.js";


function App() {
  const [message, setMessage] = useState("");
  

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.log("Error cargando mensaje.", error));
  }, []);
  
  const pedidosHechos=(pedidos)=>{
    return pedidos.filter(pedido=>pedido.usuario===1)
  }

  const pedidosRecibidos=(pedidos)=>{
    return pedidos.filter(pedido=>pedido.vendedor===1)
  }
   
  return (
    <CurrencyProvider>
    <CarritoProvider>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="/productos/:id" element={<ProductDetailPage/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/pedidos/hechos" element={<ListaPedidos funcionDeFiltrado={pedidosHechos} estadoACambiar="cancelado" mensaje="Todavía no has hechos ningún pedido ..."/>} />
          <Route path="/pedidos/recibidos" element={<ListaPedidos funcionDeFiltrado={pedidosRecibidos} estadoACambiar="enviado" mensaje="No te hicieron ningún pedido aún ..."
          />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </CarritoProvider>
    </CurrencyProvider>
  );
}

export default App;
