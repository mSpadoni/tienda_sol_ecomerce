import React, { useState, useEffect } from 'react';
import {
  Card, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  LinearProgress, Typography, Box, Alert
} from '@mui/material';
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
  const [error, setError] = useState(null);

  const initialValues = {
    username: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    rol: '',
  };

  const cancelar = () => {
    navigate(-1);
    ponerVisible();
  };

  // ✅ Validaciones
  const validate = (values) => {
    const errors = {};

    if (!values.username) errors.username = 'Usuario obligatorio';
    if (!values.nombre) errors.nombre = 'Nombre obligatorio';
    if (!values.apellido) errors.apellido = 'Apellido obligatorio';

    if (!values.email) {
      errors.email = 'Email obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Formato de email inválido';
    }

    if (!values.password) {
      errors.password = 'Contraseña obligatoria';
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

      if (!passwordRegex.test(values.password)) {
        errors.password =
          'Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.';
      }
    }

    if (!values.rol) errors.rol = 'Rol obligatorio';

    return errors;
  };

  // ✅ Envío
  const onSubmit = async (values) => {
    try {
      await crearUsuario(values);
      setMensajeExito("Usuario creado exitosamente!");
      ponerVisible();
      navigate("/");
    } catch (err) {
      setError(err);
      navigate("/sig-on");
    }
  };

  const { values, handleChange, handleBlur, handleSubmit, showError, isSubmitting, setErrors } =
    useForm(initialValues, onSubmit, validate);

  useEffect(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [values]);

  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const fieldKeys = Object.keys(values);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const camposCompletos = fieldKeys.every(
    (key) => values[key] && !showError(key)
  );

  const handleNext = () => step < fieldKeys.length - 1 && setStep(step + 1);
  const handleBack = () => {
    if (step === 0 && isMobile) {
      ponerVisible();
      navigate(-1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const opcionesRol = [
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'comprador', label: 'Comprador' },
  ];

  const passwordChecks = [
    { label: 'Al menos 8 caracteres', test: /.{8,}/ },
    { label: 'Una letra mayúscula', test: /[A-Z]/ },
    { label: 'Una letra minúscula', test: /[a-z]/ },
    { label: 'Un número', test: /\d/ },
    { label: 'Un símbolo (@$!%*?&._-)', test: /[@$!%*?&._-]/ },
  ];

  const isCurrentStepValid = () => {
    const key = fieldKeys[step];
    return values[key] && !showError(key);
  };

  return (
    <div className="registro-root">
      <Card className="registro-card">
        <h3 className="titulo">Registro de Usuario</h3>

        {/* 🔴 Mensaje de error global */}
        {error && (
          <Alert severity="error" className="alert-error">
            {error.message}
          </Alert>
        )}

        {isSubmitting && <LinearProgress sx={{ mb: 2 }} />}

        {/* ✅ FORMULARIO */}
        <form onSubmit={handleSubmit}>
          {/* GRID: todos menos password */}
          <div className="form-grid">
            {fieldKeys
              .filter((key) => key !== "password")
              .map((key, index) => {
                if (isMobile && step !== index) return null;

                if (key === "rol") {
                  return (
                    <FormControl
                      key={key}
                      fullWidth
                      className="input-field"
                      error={!!showError(key)}
                      variant="outlined"
                    >
                      <InputLabel id={`${key}-label`}>Rol</InputLabel>
                      <Select
                        labelId={`${key}-label`}
                        label="Rol"
                        name={key}
                        value={values[key]}
                        onChange={(e) => {
  handleChange(e);
  setErrors(validate({ ...values, password: e.target.value }));
}}
                        onBlur={handleBlur}
                        required
                      >
                        {opcionesRol.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {showError(key) && (
                        <p style={{ color: "red", fontSize: "0.8rem" }}>
                          {showError(key)}
                        </p>
                      )}
                    </FormControl>
                  );
                }

                // Campos normales
                return (
                  <TextField
                    key={key}
                    className="input-field"
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    required
                    fullWidth
                    value={values[key]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!showError(key)}
                    helperText={showError(key)}
                  />
                );
              })}
          </div>

          {/* 🔐 Campo de contraseña aparte del grid */}
          <Box key="password" className="password-container">
            <TextField
              label="Contraseña"
              name="password"
              required
              fullWidth
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!showError("password")}
              helperText={showError("password")}
            />
            <div className="password-rules">
              {passwordChecks.map((check) => (
                <Typography
                  key={check.label}
                  className={`rule ${
                    check.test.test(values.password) ? "ok" : "fail"
                  }`}
                >
                  {check.test.test(values.password) ? "✔️" : "❌"} {check.label}
                </Typography>
              ))}
            </div>
          </Box>

          {/* ✅ Botones */}
          <div className="actions">
            {isMobile ? (
              <>
                <Button className="btn-cancel" variant="outlined" onClick={handleBack}>
                  Atrás
                </Button>

                {step < fieldKeys.length - 1 ? (
                  <Button
                    className="btn-registrar"
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isCurrentStepValid()}
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
                <Button className="btn-cancel" variant="outlined" onClick={cancelar}>
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

          {/* Barra de progreso móvil */}
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
