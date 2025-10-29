import React, { useState, useEffect } from "react";
// import logger from "../../logger/logger.js";
import "./App.css";
import Home from './features/home/Home.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetailPage from './features/productos/ProductDetailPage.jsx';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.log("Error cargando mensaje.", error));
  }, []);

  return (
  <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/productos/:id" element={<ProductDetailPage/>} />
      </Routes>
    </BrowserRouter>);
}

export default App;
