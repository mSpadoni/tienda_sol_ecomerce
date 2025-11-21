import React, { useEffect, useState } from "react";
import { Card, TextField, Button, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../provieder/carritoProvider.jsx";
import { useCurrency } from "../../provieder/CurrencyProvider.jsx";
import { useMensajes } from "../../provieder/mensajeDeExito.jsx";
import Store from "../../components/mockData/Pedidos.js";
import "./checkout.css";
import { CURRENCIES } from "../../provieder/currencies.js";
import { useForm } from "../../provieder/formHook.js";
import { useVisible } from "../../provieder/visibleHook.jsx";
import { crearPedido } from "../../services/pedidoService.js";

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, limpiarCarrito, total } = useCarrito();
  const { currency } = useCurrency();
  const { setMensajeExito } = useMensajes();
  const { ponerVisible, ponerInvisible } = useVisible();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [step, setStep] = useState(0);

  useEffect(() => {
    ponerInvisible();
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialValues = {
    calle: "",
    altura: "",
    piso: "",
    departamento: "",
    codigoPostal: "",
    ciudad: "",
    provincia: "",
    pais: "",
  };

  const validate = (values) => {
    const errors = {};
    Object.keys(values).forEach((key) => {
      if (
        [
          "calle",
          "altura",
          "codigoPostal",
          "ciudad",
          "provincia",
          "pais",
        ].includes(key) &&
        !values[key].trim()
      ) {
        errors[key] = "Este campo es obligatorio";
      }
    });
    return errors;
  };

  const onSubmit = (values) => {

    crearPedido({
      items: carrito.map((item) => ({
        productoId: item.producto._id,
        cantidad: item.cantidad,
      })),
      direccionEntrega: {
        calle: values.calle,
        altura: values.altura,
        piso: values.piso,
        departamento: values.departamento,
        codigoPostal: values.codigoPostal,
        ciudad: values.ciudad,
        provincia: values.provincia,
        pais: values.pais,
      },
      moneda: currency,
    });

    limpiarCarrito();
    setMensajeExito("Compra realizada con éxito");
    ponerVisible();
    navigate("/");
  };

  const { values, handleChange, handleBlur, handleSubmit, errors, showError } =
    useForm(initialValues, onSubmit, validate);

  const fieldKeys = Object.keys(initialValues);

  const handleNext = () => {
    if (!values[fieldKeys[step]].trim()) return; // no avanzar si vacío
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 0 && isMobile) {
      ponerVisible();
      navigate(-1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const totalFormateado = () => {
    const total = carrito.reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0,
    );
    return `${CURRENCIES[currency].symbol}${total.toLocaleString(
      CURRENCIES[currency].locale,
    )}`;
  };

  const progress = Math.round(((step + 1) / fieldKeys.length) * 100);

  return (
    <div className="root">
      <Card className="form-container">
        {isMobile && carrito.length > 0 && (
          <div className="mobile-total">
            <span>Total: </span>
            <strong>{totalFormateado()}</strong>
          </div>
        )}

        <div className="checkout-form">
          <h3>Datos de entrega</h3>
          {isMobile && (
            <LinearProgress variant="determinate" value={progress} />
          )}
          <form className="form-grid" onSubmit={handleSubmit}>
            {fieldKeys.map((key, index) => {
              if (isMobile && index !== step) return null; // mostrar solo paso actual
              return (
                <div className="input-wrapper" key={key}>
                  <TextField
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value={values[key]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required={[
                      "calle",
                      "altura",
                      "codigoPostal",
                      "ciudad",
                      "provincia",
                      "pais",
                    ].includes(key)}
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
                </div>
              );
            })}

            <div >
              {isMobile && (
                <Button
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
                      border: "3px solid #113369 !important" ,
                    },
                  }}
                  variant="outlined"
                >
                  Atrás
                </Button>
              )}
              {isMobile && step < fieldKeys.length - 1 && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!values[fieldKeys[step]].trim()}
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
              )}
              {(!isMobile || step === fieldKeys.length - 1) && (
                <>
                  <Button
                    onClick={() => {
                      limpiarCarrito();
                      ponerVisible();
                      navigate("/");
                    }}
                    variant="outlined"
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
                        border: "3px solid #113369 !important",
                      },
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={
                      ![
                        "calle",
                        "altura",
                        "codigoPostal",
                        "ciudad",
                        "provincia",
                        "pais",
                      ].every((key) => values[key].trim() !== "")
                    }
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
                    Comprar
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>

        {!isMobile && (
          <div className="checkout-summary">
            <h4>Resumen del carrito</h4>
            <div className="items-list">
              {carrito.map((item, index) => (
                <div className="item-products" key={index}>
                  <span>
                    {item.producto.titulo} x {item.cantidad}
                  </span>
                  <span>
                    {CURRENCIES[currency].symbol}
                    {(item.producto.precio * item.cantidad).toLocaleString(
                      CURRENCIES[currency].locale,
                    )}
                  </span>
                </div>
              ))}
            </div>
            <hr />
            <div className="item-summary" style={{ fontWeight: "bold" }}>
              <span>{`Total: ${totalFormateado()}`}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Checkout;
