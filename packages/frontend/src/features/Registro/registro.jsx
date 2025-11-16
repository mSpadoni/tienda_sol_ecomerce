import React, { useState, useEffect } from "react";
import {
  Card,
  TextField,
  Button,
  LinearProgress,
  Typography,
  Alert,
  ButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useVisible } from "../../provieder/visibleHook.jsx";
import { crearUsuario } from "../../services/userServices.js";
import { useMensajes } from "../../provieder/mensajeDeExito.jsx";
import { useForm } from "../../provieder/formHook.js";
import "./registro.css";

const RegistroUsuario = () => {
  const navigate = useNavigate();
  const { ponerVisible } = useVisible();
  const { setMensajeExito } = useMensajes();
  const [error, setError] = useState(null);

  const initialValues = {
    username: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
  };

  const cancelar = () => {
    navigate("/");
    ponerVisible();
  };

  const validate = (values) => {
    const errors = {};

    if (!values.username) errors.username = "Usuario obligatorio";
    if (!values.nombre) errors.nombre = "Nombre obligatorio";
    if (!values.apellido) errors.apellido = "Apellido obligatorio";

    if (!values.email) {
      errors.email = "Email obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Formato de email inválido";
    }

    if (!values.telefono) {
      errors.telefono = "Teléfono obligatorio";
    } else if (!/^[0-9]{7,15}$/.test(values.telefono)) {
      errors.telefono = "Formato de teléfono inválido";
    }

    if (!values.password) {
      errors.password = "Contraseña obligatoria";
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

      if (!passwordRegex.test(values.password)) {
        errors.password =
          "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.";
      }
    }

    return errors;
  };

  const onSubmit = async (values) => {
    try {
      await crearUsuario(values);
      setMensajeExito("Usuario creado exitosamente!");
      ponerVisible();
      navigate("/");
    } catch (err) {
      setError(err);
      navigate("/registro");
    }
  };

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    showError,
    isSubmitting,
    setErrors,
  } = useForm(initialValues, onSubmit, validate);

  useEffect(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [values, setErrors]);

  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fieldKeys = Object.keys(values);
  const totalSteps = fieldKeys.length + 1;

  const camposCompletos = fieldKeys.every(
    (key) => values[key] && !validate(values)[key],
  );

  const handleNext = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0 && isMobile) {
      ponerVisible();
      navigate("/");
    } else if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const passwordChecks = [
    { label: "Al menos 8 caracteres", test: /.{8,}/ },
    { label: "Una letra mayúscula", test: /[A-Z]/ },
    { label: "Una letra minúscula", test: /[a-z]/ },
    { label: "Un número", test: /\d/ },
    { label: "Un símbolo (@$!%*?&._-)", test: /[@$!%*?&._-]/ },
  ];

  const isCurrentStepValid = () => {
    const key = fieldKeys[step];
    return values[key] && !validate(values)[key];
  };

  return (
    <div className="registro-root">
      <Card className="registro-card">
        <h3 className="titulo">Registro de Usuario</h3>

        {error && (
          <Alert severity="error" className="alert-error">
            {error.message}
          </Alert>
        )}

        {isSubmitting && <LinearProgress sx={{ mb: 2 }} />}

        <form onSubmit={handleSubmit}>
          {(!isMobile || step <= fieldKeys.length) && (
            <div className="form-grid">
              {fieldKeys.map((key, index) => {
                if (isMobile && index !== step) return null;

                return (
                  <>
                    <TextField
                      variant="outlined"
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      required
                      fullWidth
                      value={values[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!showError(key)}
                      helperText={showError(key)}
                     sx={{
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1F2937 !important",
    borderWidth: "2px !important",
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#122744ff !important",
    borderWidth: "3px !important",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#0f1f36ff !important",
    borderWidth: "3px !important",
  }
}}

                    />
                    {index === 5 && (
                      <div className="password-rules">
                        {passwordChecks.map((check) => (
                          <Typography
                            key={check.label}
                            className={`rule ${check.test.test(values.password) ? "ok" : "fail"}`}
                          >
                            {check.test.test(values.password) ? "✔️" : "❌"}{" "}
                            {check.label}
                          </Typography>
                        ))}
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          )}

          <div>
            {isMobile ? (
              <>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    "&.MuiButton-outlined": {
                      borderColor: "#16427f !important",
                      color: "#16427f !important",
                      borderRadius: 2,
                      padding: "6px 16px",
                      marginRight: 1,
                      marginTop: 2
                    },
                    "&.Mui-disabled": {
      borderColor: "rgba(22, 66, 127, 0.4) !important",
      color: "rgba(22, 66, 127, 0.4) !important",
    },
                    "&:hover": {
                      borderColor: "#113369 !important",
                      backgroundColor: "rgba(22, 66, 127, 0.08) !important",
                      border: "2px solid #113369 !important" ,
                    },

                   
                  }}
                >
                  Atrás
                </Button>

                {step < totalSteps - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isCurrentStepValid()}
                    sx={{
                    "&.MuiButton-contained": {
                      backgroundColor: "#16427f !important",
                      color: "#ffffff !important",
                      borderRadius: 2,
                        marginTop: 2
                    },
                    "&.Mui-disabled": {
      backgroundColor: "rgba(22, 66, 127, 0.4) !important", 
      color: "rgba(255, 255, 255, 0.6) !important",
    },
                    "&:hover": {
                      backgroundColor: "#113369 !important",
                    },
                  }}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    onClick={() => onSubmit(values)}
                    type="submit"
                    variant="contained"
                    disabled={!camposCompletos || isSubmitting}
                    sx={{
                    "&.MuiButton-contained": {
                      backgroundColor: "#16427f !important",
                      color: "#ffffff !important",
                      borderRadius: 2,
                      marginTop: 2,
                    },
                    "&.Mui-disabled": {
      backgroundColor: "rgba(22, 66, 127, 0.4) !important", 
      color: "rgba(255, 255, 255, 0.6) !important",
    },
                    "&:hover": {
                      backgroundColor: "#113369 !important",
                    },
                  }}
                  >
                    Registrar
                  </Button>
                )}
              </>
            ) : (
              <ButtonGroup
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                }}
              >
                {/* Botón Cancelar */}
                <Button
                  variant="outlined"
                  onClick={cancelar}
                  sx={{
                    "&.MuiButton-outlined": {
                      borderColor: "#16427f !important",
                      color: "#16427f !important",
                      borderRadius: 2,
                       marginTop: 2,
                      marginRight: 1
                    },
                    "&.Mui-disabled": {
      borderColor: "rgba(22, 66, 127, 0.4) !important",
      color: "rgba(22, 66, 127, 0.4) !important",
    },
                    "&:hover": {
                      borderColor: "#113369 !important",
                      backgroundColor: "rgba(22, 66, 127, 0.08) !important",
                    },
                  }}
                >
                  Cancelar
                </Button>

                {/* Botón Registrar */}
                <Button
                  onClick={() => onSubmit(values)}
                  type="submit"
                  variant="contained"
                  disabled={!camposCompletos || isSubmitting}
                  sx={{
                    "&.MuiButton-contained": {
                      backgroundColor: "#16427f !important",
                      color: "#ffffff !important",
                      borderRadius:2.5,
                      marginTop: 2,
                    },
                    "&.Mui-disabled": {
      backgroundColor: "rgba(22, 66, 127, 0.4) !important", 
      color: "rgba(255, 255, 255, 0.6) !important",
    },
                    "&:hover": {
                      backgroundColor: "#113369 !important",
                    },
                  }}
                >
                  Registrar
                </Button>
              </ButtonGroup>
            )}
          </div>

          {isMobile && (
            <LinearProgress
              variant="determinate"
              value={((step + 1) / totalSteps) * 100}
              sx={{ mt: 2 }}
            />
          )}
        </form>
      </Card>
    </div>
  );
};

export default RegistroUsuario;
