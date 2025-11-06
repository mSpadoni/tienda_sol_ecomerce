import React, { useState } from 'react';
import {
  Card,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useVisible } from "../../provieder/visibleHook.jsx";
import { crearUsuario } from '../../services/userServices.js';
import { useMensajes  } from "../../provieder/mensajeDeExito.jsx";
import './registro.css';

const RegistroUsuario = () => {
  const navigate = useNavigate();
  const { ponerVisible } = useVisible();
  const { setMensajeExito } = useMensajes();

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

  const [errores, setErrores] = useState(null);

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
    setErrores(null);
    const data = {
      username: campos.username.valor,
      nombre: campos.nombre.valor,
      apellido: campos.apellido.valor,
      email: campos.email.valor,
      telefono: campos.telefono.valor,
      password: campos.password.valor,
      rol: campos.rol.valor,
    };

    try {
      const result = await crearUsuario(data);
      setMensajeExito("Usuario creado exitosamente!");
      ponerVisible();
      navigate("/");
    } catch (err) {
      setErrores(err);
    }
  };

  return (
    <div className="registro-root">
      <Card className="registro-card">
        <h3 className="titulo">Registro de Usuario</h3>

        {errores && (
          <Alert severity="error" className="alert-error">
            {errores.message}
          </Alert>
        )}

        <form className="form-grid">
          <TextField
            className="input-field"
            label="UserName"
            required
            fullWidth
            value={campos.username.valor}
            onChange={setValorDe("username")}
          />
          <TextField
            className="input-field"
            label="Nombre"
            required
            fullWidth
            value={campos.nombre.valor}
            onChange={setValorDe('nombre')}
          />
          <TextField
            className="input-field"
            label="Apellido"
            required
            fullWidth
            value={campos.apellido.valor}
            onChange={setValorDe('apellido')}
          />
          <TextField
            className="input-field"
            label="Email"
            required
            fullWidth
            type='email'
            value={campos.email.valor}
            onChange={setValorDe('email')}
          />
          <TextField
            className="input-field"
            label="Teléfono"
            fullWidth
            value={campos.telefono.valor}
            onChange={setValorDe('telefono')}
          />
          <TextField
            className="input-field"
            label="Contraseña"
            required
            fullWidth
            type='password'
            value={campos.password.valor}
            onChange={setValorDe('password')}
          />

          <FormControl fullWidth className="input-field">
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

          <div className="actions">
            <Button
              className="btn-cancel"
              variant="outlined"
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>
            <Button
              className="btn-registrar"
              variant="contained"
              disabled={!camposCompletos}
              onClick={handleRegistrar}
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
