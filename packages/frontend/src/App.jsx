import React, { useState, useEffect } from "react";
// import logger from "../../logger/logger.js";
import "./App.css";
import Home from "./features/home/Home.jsx";
import About from "./features/About/About.jsx";
import Contactanos from "./features/Contacto/Contactanos.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetailPage from "./features/productos/ProductDetailPage.jsx";
import Layout from "./features/Layout/layout.jsx";
import { CarritoProvider } from "./provieder/carritoProvider.jsx";
import { CurrencyProvider } from "./provieder/CurrencyProvider.jsx";
import Checkout from "./features/Checkuot/checkout.jsx";
import ListaPedidos from "./features/Pedidos/pedido.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { KeycloakProvider } from "./provieder/keyCloak.jsx";
import SessionTimeout from "./provieder/SessionTimeOut.jsx";
import RegistroUsuario from "./features/Registro/registro.jsx";
import ListaNotificaciones from "./features/Notificacion/notificacion.jsx";
import ProtectedRoute from "./protecciones/ProtectedRoute.jsx";
import { VisibleProvider } from "./provieder/visibleHook.jsx";
import { MensajeProvider } from "./provieder/mensajeDeExito.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#272323ff",
    },
  },
});

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.log("Error cargando mensaje.", error));
  }, []);

  const pedidosHechos = (pedidos) => {
    return pedidos.filter((pedido) => pedido.usuario === 1);
  };

  const sortPedidosVendedor = (pedidos) => {
    const estadoOrdenPrioridad = {
      confirmado: 1,
      enviado: 2,
      cancelado: 3,
      rechazado: 4,
      finalizado: 5,
    };
    return pedidos.sort((a, b) => estadoOrdenPrioridad[a.estado] - estadoOrdenPrioridad[b.estado]);
  }

    const sortPedidosComprador = (pedidos) => {
    const estadoOrdenPrioridad = {
      confirmado: 2,
      enviado: 1,
      rechazado: 3,
      cancelado: 4,
      finalizado: 5,
    };
    return pedidos.sort((a, b) => estadoOrdenPrioridad[a.estado] - estadoOrdenPrioridad[b.estado]);
  }

  const pedidosRecibidos = (pedidos) => {
    return pedidos.filter((pedido) => pedido.vendedor === 1);
  };

  const notificacionesLeidas = (notificaciones) => {
    return notificaciones.filter((notificacion) => notificacion.leida === true);
  };
  const notificacionesNoLeidas = (notificaciones) => {
    return notificaciones.filter(
      (notificacion) => notificacion.leida === false,
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <KeycloakProvider>
        <SessionTimeout />

        <CurrencyProvider>
          <CarritoProvider>
            <VisibleProvider>
              <MensajeProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/sig-on" element={<RegistroUsuario />} />
                      <Route path="/sobre-nosotros" element={<About />} />
                      <Route path="/contactanos" element={<Contactanos />} />
                      <Route element={<ProtectedRoute />}>
                        <Route
                          path="/productos/:id"
                          element={<ProductDetailPage />}
                        />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route
                          path="/pedidos/hechos"
                          element={
                            <ListaPedidos
                              funcionDeOrdenamiento={sortPedidosComprador}
                              tipoDePedidos = "hechos"
                              pathBackend = "/pedidos/hechos"
                              estadoParaAvanzar="finalizado"
                              estadoParaAbortar="cancelado"
                              estadoParaMostrar="enviado"
                              mensaje="Todavía no has hechos ningún pedido ..."
                              existoMessage="Se cancelo el pedido correctamente..."
                              ruta="/pedidos/hechos"
                            />
                          }
                        />
                        <Route
                          path="/pedidos/recibidos"
                          element={
                            <ListaPedidos
                              funcionDeOrdenamiento={sortPedidosVendedor}
                              tipoDePedidos = "recibidos"
                              pathBackend = "/pedidos/recibidos"
                              estadoParaAvanzar="enviado"
                              estadoParaAbortar="rechazado"
                              estadoParaMostrar="confirmado"
                              mensaje="No te hicieron ningún pedido aún ..."
                              existoMessage="Se envio el pedido correctamente..."
                              ruta="/pedidos/recibidos"
                            />
                          }
                        />
                        <Route
                          path="/notificaciones"
                          element={<ListaNotificaciones />}
                        />
                      </Route>
                      <Route path="*" element={<div>404 Not Found</div>} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </MensajeProvider>
            </VisibleProvider>
          </CarritoProvider>
        </CurrencyProvider>
      </KeycloakProvider>
    </ThemeProvider>
  );
}

export default App;
