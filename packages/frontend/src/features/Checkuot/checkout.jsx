import React, { useState } from 'react';
import { Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useCarrito } from '../../provieder/carritoProvider.jsx';
import { useCurrency } from '../../provieder/CurrencyProvider.jsx';
import { useMensajes } from '../../provieder/mensajeDeExito.jsx';
import Store from "../../components/mockData/Pedidos.js";
import './checkout.css';
import { CURRENCIES } from '../../provieder/currencies.js';
import { useForm} from "../../provieder/fromHook.js"


const Checkout = () => {
  const inicializarCampo = (requerido = true) => ({ valor: '', requerido });
  const navigate = useNavigate();
  const { carrito, setCarrito, totalPrecio , limpiarCarrito} = useCarrito();
  const { currency } = useCurrency();
  const { setMensajeExito} = useMensajes();

  const inicializarCampos = () => ({
    calle: inicializarCampo(),
    altura: inicializarCampo(),
    piso: inicializarCampo(false),
    departamento: inicializarCampo(false),
    codigoPostal: inicializarCampo(),
    ciudad: inicializarCampo(),
    provincia: inicializarCampo(),
    pais: inicializarCampo(),
    lat: inicializarCampo(false),
    lon: inicializarCampo(false),
  });

  const [campos, setCampos] = useState(inicializarCampos());

  const camposCompletos = Object.values(campos)
    .filter(campo => campo.requerido)
    .every(campo => campo.valor.trim() !== '');

  const setValorDe = (campo) => (event) => {
    setCampos(prev => ({
      ...prev,
      [campo]: { ...prev[campo], valor: event.target.value }
    }));
  };

  let id = 1;

  const handleGuardar = () => {
      Store.Pedidos.push({
        id: id,
        usuario: 1,
        vendedor: 2,
        items: carrito.map(item => ({
          producto: item.producto,
          cantidad: item.cantidad,
        })),
        direccionEntrega: {
          calle: campos.calle.valor,
          altura: campos.altura.valor,
          piso: campos.piso.valor,
          departamento: campos.departamento.valor,
          codigoPostal: campos.codigoPostal.valor,
          ciudad: campos.ciudad.valor,
          provincia: campos.provincia.valor,
          pais: campos.pais.valor,
          lat: campos.lat.valor,
          long: campos.lon.valor,
        },
        moneda: currency,
        estado: 'Pendiente',
        total: totalPrecio(),
        Fecha: new Date(),
      });

      limpiarCarrito()
      id++;
      setMensajeExito("Compra realizada con éxito");
      navigate("/");
  };

  const obtenerTotalFormateado = (carrito, currency) => {
    if (!carrito || carrito.length === 0) return `${CURRENCIES[currency].symbol}0`;

    const total = carrito.reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0
    );

    return `${CURRENCIES[currency].symbol}${total.toLocaleString(CURRENCIES[currency].locale)}`;
  };

  return (
    <div className="root">
      <Card className="form-container">
        <div className="checkout-form">
          <h3>Datos de entrega</h3>
          <form className="form-grid">
            <div className="input-wrapper">
              <TextField
                label="Calle"
                required
                fullWidth
                value={campos.calle.valor}
                onChange={setValorDe('calle')}
              />
            </div>

            <div className="input-wrapper">
              <TextField
                label="Altura"
                value={campos.altura.valor}
                onChange={setValorDe('altura')}
              />
            </div>

            <div className="input-wrapper">
              <TextField
                label="Piso"
                value={campos.piso.valor}
                onChange={setValorDe('piso')}
              />
            </div>

            <div className="input-wrapper">
              <TextField
                label="Departamento"
                value={campos.departamento.valor}
                onChange={setValorDe('departamento')}
              />
            </div>

            <div className="input-wrapper">
              <TextField
                label="Código Postal"
                required
                value={campos.codigoPostal.valor}
                onChange={setValorDe('codigoPostal')}
              />
            </div>

            <div className="input-wrapper">
              <TextField
                label="Ciudad"
                required
                value={campos.ciudad.valor}
                onChange={setValorDe('ciudad')}
              />
            </div>

            <div className="input-wrapper">
              <TextField
                label="Provincia"
                required
                value={campos.provincia.valor}
                onChange={setValorDe('provincia')}
              />
            </div>

            <div className="input-wrapper">
              <TextField  
                label="País"
                required
                value={campos.pais.valor}
                onChange={setValorDe('pais')}
              />
            </div>

            <div className="input-wrapper">
              <TextField
                label="Latitud"
                value={campos.lat.valor}
                onChange={setValorDe('lat')}
              />
            </div>

            <div className="input-wrapper">
              <TextField
                label="Longitud"
                value={campos.lon.valor}
                onChange={setValorDe('lon')}
              />
            </div>

            <div className="actions">
              <Button onClick={() => navigate("/")}>Cancelar</Button>
              <Button 
                variant="contained" 
                disabled={!camposCompletos}
                onClick={handleGuardar}
              >
                Comprar
              </Button>
            </div>
          </form>
        </div>

        <div className="checkout-summary">
          <h4>Resumen del carrito</h4>
          <div className="items-list">
            {carrito.map((item, index) => (
              <div className="item-summary" key={index}>
                <span>{item.producto.titulo} x {item.cantidad}</span>
                <span>
                  {CURRENCIES[currency].symbol}
                  {(item.producto.precio * item.cantidad).toLocaleString(CURRENCIES[currency].locale)}
                </span>
              </div>
            ))}
          </div>
          <hr />
          <div className="item-summary" style={{ fontWeight: 'bold' }}>
            <span>Total</span>
            <span>{obtenerTotalFormateado(carrito, currency)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
