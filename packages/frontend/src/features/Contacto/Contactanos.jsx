import React, { useState } from "react";
import "./Contactanos.css";

const Contactanos = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías enviar al backend; por ahora solo mostramos en consola
    console.log("Contacto enviado:", form);
    alert("Mensaje enviado. Gracias por contactarnos.");
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <main className="contact-page">
      <h1>Contáctanos</h1>
      <p className="lead">¿Tienes una duda o necesitas ayuda? Envíanos un mensaje.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={handleChange} />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Mensaje
          <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={6} />
        </label>
        <button type="submit" className="btn-primary">Enviar</button>
      </form>
    </main>
  );
};

export default Contactanos;
