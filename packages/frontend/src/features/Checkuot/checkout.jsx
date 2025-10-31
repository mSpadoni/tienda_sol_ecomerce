import React, { useState } from 'react';
import { Card, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useCarrito } from '../../provieder/carritoProvider.jsx';
import Pedido from '../../components/mockData/Pedidos.js';
import { useCurrency } from '../../provieder/CurrencyProvider.jsx';


import './checkout.css';
import { CURRENCIES } from '../../provieder/currencies.js';


const Checkout = () => {
  const inicializarCampo = (requerido = true) => ({ valor: '', requerido });
  const navigate = useNavigate()
    const { carrito, setCarrito,totalPrecio } = useCarrito();
    const { currency } = useCurrency();

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

  let id=1

  const handleGuardar = () => {
    alert('¡Compra realizada con éxito!')
    Pedido.push({
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
        moneda: CURRENCIES[currency].symbol,
        estado: 'Pendiente',
        total: totalPrecio(),
        Fecha: new Date(),
    })
    setCarrito([]);
    id++
    navigate("/")
  };

  return (
    <div className="root">
      <Card className="form-container">
        <h3>Ya casi estamos...</h3>
        <div>
          {carrito.map((item, index) => (
            <div key={index}>
              {item.producto.titulo}: {item.cantidad}
            </div>
          ))}
        </div>
        
        <form>
          <TextField
            label="Calle"
            required
            fullWidth
            margin="normal"
            type='text'
            value={campos.calle.valor}
            onChange={setValorDe('calle')}
          />
          <TextField
            label="Altura"
            fullWidth
            margin="normal"
            type='text'
            value={campos.altura.valor}
            onChange={setValorDe('altura')}
          />
          <TextField
            label="Piso"
            required
            fullWidth
            margin="normal"
            type='text'
            value={campos.piso.valor}
            onChange={setValorDe('piso')}
          />
          <TextField
            label="Departamento"
            required
            fullWidth
            margin="normal" 
            type='text'
            value={campos.departamento.valor}
            onChange={setValorDe('departamento')}
          />
          <TextField
            label="Código Postal"
            required
            fullWidth
            margin="normal"
            type="text"
            value={campos.codigoPostal.valor}
            onChange={setValorDe('codigoPostal')}
          />
          <TextField
            label="Ciudad"
            required
            fullWidth
            margin="normal"
            type="text"
            value={campos.ciudad.valor}
            onChange={setValorDe('ciudad')}
          />
          <TextField
            label="Provincia"
            required
            fullWidth
            margin="normal"
            type="text"
            value={campos.provincia.valor}
            onChange={setValorDe('provincia')}
          />
            <TextField  
            label="País"
            required
            fullWidth
            margin="normal"
            type="text"
            value={campos.pais.valor}
            onChange={setValorDe('pais')}
          />
          <TextField    
              label="Latitud"
            fullWidth
            margin="normal"
            type="text"
            value={campos.lat.valor}
            onChange={setValorDe('lat')}
            />
            <TextField
            label="Longitud"
            fullWidth
            margin="normal"
            type="text"
            value={campos.lon.valor}
            onChange={setValorDe('lon')}
          />
        <div className="actions">
            <Button onClick={() => {}}>Cancelar</Button>
            <Button 
              variant="contained" 
              disabled={!camposCompletos}
              onClick={handleGuardar}
            >
              Guardar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Checkout;