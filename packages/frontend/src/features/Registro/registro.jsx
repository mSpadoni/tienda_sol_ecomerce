import React, { useState } from 'react';
import { Card, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useVisible } from "../../provieder/visibleHook.jsx";
import { crearUsuario } from '../../services/userServices.js';

const RegistroUsuario = () => {
  const navigate = useNavigate();
  const {ponerVisible}=useVisible()

  // Inicialización de campos
  const inicializarCampo = (requerido = true) => ({ valor: '', requerido });
  const [campos, setCampos] = useState({
    nombre: inicializarCampo(),
    apellido: inicializarCampo(),
    email: inicializarCampo(),
    telefono: inicializarCampo(),
    password: inicializarCampo(),
    rol: inicializarCampo(),
    username: inicializarCampo(),
  });

  const [error, setError] = useState("");

  const camposCompletos = Object.values(campos)
    .filter(campo => campo.requerido)
    .every(campo => campo.valor.trim() !== '');

  const setValorDe = (campo) => (event) => {
    setCampos(prev => ({
      ...prev,
      [campo]: { ...prev[campo], valor: event.target.value }
    }));
  };

  const handleRegistrar = async () => {
  const data = {
    username: campos.username.valor,
    nombre: campos.nombre.valor,
    apellido: campos.apellido.valor,
    email: campos.email.valor,
    telefono: campos.telefono.valor,
    password: campos.password.valor,
    rol: campos.rol.valor,
  };

  console.log("DATA QUE ENVÍO:", data);

  try {
    const result = await crearUsuario(data);
    console.log("Usuario creado:", result);

    ponerVisible();
    navigate("/");
  } catch (err) {
    console.error(err);
    setError(err?.response?.data?.message || "Error al crear usuario");
  }
};


  return (
    <div className="root">
      <Card className="form-container">
        <h3>Registro de Usuario</h3>

        {error && <div className="error-message">{error}</div>}

        <form>
          <TextField
  label="UserName"
  required
  fullWidth
  margin="normal"
  type="text"
  value={campos.username.valor}
  onChange={(e) => {
    console.log("username typed:", e.target.value);
    setValorDe("username")(e);
  }}
/>

          <TextField
            label="Nombre"
            required
            fullWidth
            margin="normal"
            type='text'
            value={campos.nombre.valor}
            onChange={setValorDe('nombre')}
          />
          <TextField
            label="Apellido"
            required
            fullWidth
            margin="normal"
            type='text'
            value={campos.apellido.valor}
            onChange={setValorDe('apellido')}
          />
          <TextField
            label="Email"
            required
            fullWidth
            margin="normal"
            type='email'
            value={campos.email.valor}
            onChange={setValorDe('email')}
          />
          <TextField
            label="Teléfono"
            fullWidth
            margin="normal"
            type='text'
            value={campos.telefono.valor}
            onChange={setValorDe('telefono')}
          />
          <TextField
            label="Contraseña"
            required
            fullWidth
            margin="normal"
            type='password'
            value={campos.password.valor}
            onChange={setValorDe('password')}
          />

          {/* Selección de rol */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              value={campos.rol.valor}
              onChange={setValorDe('rol')}
              required
            >
              <MenuItem value="vendedor">Vendedor</MenuItem>
              <MenuItem value="comprador">Comprador</MenuItem>
            </Select>
          </FormControl>

          <div className="actions" style={{ marginTop: '20px' }}>
            <Button variant="outlined" onClick={() => navigate("/")}>Cancelar</Button>
            <Button 
              variant="contained" 
              disabled={!camposCompletos}
              onClick={handleRegistrar}
              style={{ marginLeft: '10px' }}
            >
              Registrar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegistroUsuario;
