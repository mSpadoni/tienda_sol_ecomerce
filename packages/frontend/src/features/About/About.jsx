import React from "react";
import "./About.css";

const About = () => {
  return (
    <main className="about-page">
      <section className="about-hero">
        <h1>Sobre nosotros</h1>
        <p className="lead">Somos Tienda del Sol: conectamos personas con productos de calidad.</p>
      </section>

      <section className="about-content">
        <h2>Nuestra historia</h2>
        <p>
          Nacimos con la misión de facilitar compras online confiables y sencillas.
          Trabajamos día a día para ofrecer una gran variedad de productos,
          atención al cliente y envíos rápidos.
        </p>

        <h2>Qué hacemos</h2>
        <p>
          Ofrecemos una plataforma donde compradores y vendedores se encuentran
          de forma segura. Promovemos buenas prácticas, atención personalizada y
          la mejor experiencia de compra.
        </p>
      </section>
    </main>
  );
};

export default About;
