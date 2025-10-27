import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/headers/Header.jsx";
import Navbar from "./components/headers/Navbar.jsx";
import ProductDetailPage from "./components/ProductDetailPage/ProductDetailPage.jsx";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error cargando mensaje.", error));
  }, []);

  return (
    <>
      <Header></Header>
      <Navbar></Navbar>
      <ProductDetailPage id='2'></ProductDetailPage>

    </>
  );
}

export default App;
