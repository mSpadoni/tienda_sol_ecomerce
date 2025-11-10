import React, { useState, useEffect } from 'react';
import { Card, TextField, Button, FormControl, InputLabel, Select, MenuItem, LinearProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useVisible } from "../../provieder/visibleHook.jsx";
import { crearUsuario } from '../../services/userServices.js';
import { useMensajes } from "../../provieder/mensajeDeExito.jsx";
import { useForm } from '../../provieder/formHook.js';
import './registro.css';

const RegistroUsuario = () => {
  const navigate = useNavigate();
  const { ponerVisible } = useVisible();
  const { setMensajeExito } = useMensajes();

  const initialValues = {
    username: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    rol: ''
  };

  const cancelar=()=>{
    navigate(-1)
    ponerVisible()
  }

  const validate = (values) => {
    const errors = {};
    if (!values.username) errors.username = 'Usuario obligatorio';
    if (!values.nombre) errors.nombre = 'Nombre obligatorio';
    if (!values.apellido) errors.apellido = 'Apellido obligatorio';
    if (!values.email) errors.email = 'Email obligatorio';
    if (!values.password) errors.password = 'Contraseña obligatoria';
    if (!values.rol) errors.rol = 'Rol obligatorio';
    return errors;
  };

  const onSubmit = async (values) => {
    await crearUsuario(values);
    setMensajeExito("Usuario creado exitosamente!");
    ponerVisible();
    navigate("/");
  };
  

  const { values, handleChange, handleBlur, handleSubmit, showError, isSubmitting } = useForm(initialValues, onSubmit, validate);

  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const fieldKeys = Object.keys(values);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const camposCompletos = fieldKeys.every(key => values[key] && !showError(key));

  const handleNext = () => step < fieldKeys.length - 1 && setStep(step + 1);

  const handleBack = () => {
    if (step === 0 && isMobile) {
      ponerVisible()
      navigate(-1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const opcionesRol = [
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'comprador', label: 'Comprador' }
  ];

  // Bloquea "Siguiente" si el campo actual está vacío o tiene error
  const isCurrentStepValid = () => {
    const key = fieldKeys[step];
    return values[key] && !showError(key);
  };

  return (
    <div className="registro-root">
      <Card className="registro-card">
        <h3 className="titulo">Registro de Usuario</h3>

        {isSubmitting && <LinearProgress sx={{ mb: 2 }} />}
        <form onSubmit={handleSubmit} className="form-grid">

          {fieldKeys.map((key, index) => {
            if (isMobile && step !== index) return null;

            if (key === 'rol') {
              return (
                <FormControl key={key} fullWidth className="input-field" error={!!showError(key)}>
                  <InputLabel id={`${key}-label`}>Rol</InputLabel>
                  <Select
                    labelId={`${key}-label`}
                    name={key}
                    value={values[key]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  >
                    {opcionesRol.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                  {showError(key) && <p style={{ color: 'red', fontSize: '0.8rem' }}>{showError(key)}</p>}
                </FormControl>
              );
            }

            return (
              <TextField
                key={key}
                className="input-field"
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                name={key}
                required
                fullWidth
                type={key === 'password' ? 'password' : 'text'}
                value={values[key]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!showError(key)}
                helperText={showError(key)}
              />
            );
          })}

          <div className="actions">
            {isMobile ? (
              <>
                <Button
                  className="btn-cancel"
                  variant="outlined"
                  onClick={handleBack}
                >
                  Atrás
                </Button>

                {step < fieldKeys.length - 1 ? (
                  <Button
                    className="btn-registrar"
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isCurrentStepValid()} // Aquí bloquea si el campo actual no tiene valor o tiene error
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    className="btn-registrar"
                    type="submit"
                    variant="contained"
                    disabled={!camposCompletos || isSubmitting}
                  >
                    Registrar
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  className="btn-cancel"
                  variant="outlined"
                  onClick={cancelar}
                >
                  Cancelar
                </Button>
                <Button
                  className="btn-registrar"
                  type="submit"
                  variant="contained"
                  disabled={!camposCompletos || isSubmitting}
                >
                  Registrar
                </Button>
              </>
            )}
          </div>

          {isMobile && (
            <LinearProgress
              variant="determinate"
              value={((step + 1) / fieldKeys.length) * 100}
              sx={{ mt: 2 }}
            />
          )}
        </form>
      </Card>
    </div>
  );
};

export default RegistroUsuario;

