import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        {/* Columna 1: Acerca de la empresa y contacto */}
        <section className="footer-section" aria-labelledby="about-heading">
          <h4 id="about-heading">Acerca de nosotros</h4>
          <p>
            Tienda del Sol es tu destino de compras online, ofreciendo productos
            de calidad con atención personalizada. Nos apasiona conectar a
            nuestros clientes con lo mejor del mercado, garantizando confianza y
            comodidad en cada compra.
          </p>
          <h4 className="mt-4" id="contact-heading">Contacto</h4>
          <ul aria-labelledby="contact-heading">
            <li>
              Email:{" "}
              <a href="mailto:tiendaDelSol@gmail.com" aria-label="Enviar email a tiendaDelSol@gmail.com">
                tiendaDelSol@gmail.com
              </a>
            </li>
            <li>Teléfono: <a href="tel:+541112345678" aria-label="Llamar al (011) 1234-5678">(011) 1234-5678</a></li>
          </ul>
        </section>

        {/* Columna 2: Misión, Visión y Valores */}
        <section className="footer-section" aria-labelledby="mission-heading">
          <h4 id="mission-heading">Misión</h4>
          <p>
            Brindar productos de alta calidad y un servicio excepcional que haga
            de cada compra una experiencia única y confiable para nuestros
            clientes.
          </p>

          <h4 className="mt-4" id="vision-heading">Visión</h4>
          <p>
            Ser la tienda online líder en satisfacción del cliente, reconocida
            por innovación, confiabilidad y compromiso con la excelencia.
          </p>

          <h4 className="mt-4" id="values-heading">Valores</h4>
          <ul aria-labelledby="values-heading">
            <li>Calidad y confianza</li>
            <li>Atención al cliente</li>
            <li>Innovación y mejora continua</li>
            <li>Responsabilidad social</li>
          </ul>
        </section>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Tienda del Sol. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;