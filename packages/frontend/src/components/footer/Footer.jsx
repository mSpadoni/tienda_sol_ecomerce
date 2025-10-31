import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Columna 1: Acerca de la empresa y contacto */}
        <div className="footer-section">
          <h4>Acerca de nosotros</h4>
          <p>
            Tienda del Sol es tu destino de compras online, ofreciendo productos de calidad
            con atención personalizada. Nos apasiona conectar a nuestros clientes con
            lo mejor del mercado, garantizando confianza y comodidad en cada compra.
          </p>
          <h4 className="mt-4">Contacto</h4>
          <ul>
            <li>
              Email: <a href="mailto:tiendaDelSol@gmail.com">tiendaDelSol@gmail.com</a>
            </li>
            <li>Teléfono: (011) 1234-5678</li>
          </ul>
        </div>

        {/* Columna 2: Misión, Visión y Valores */}
        <div className="footer-section">
          <h4>Misión</h4>
          <p>
            Brindar productos de alta calidad y un servicio excepcional que haga de cada
            compra una experiencia única y confiable para nuestros clientes.
          </p>

          <h4 className="mt-4">Visión</h4>
          <p>
            Ser la tienda online líder en satisfacción del cliente, reconocida por
            innovación, confiabilidad y compromiso con la excelencia.
          </p>

          <h4 className="mt-4">Valores</h4>
          <ul>
            <li>Calidad y confianza</li>
            <li>Atención al cliente</li>
            <li>Innovación y mejora continua</li>
            <li>Responsabilidad social</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Tienda del Sol. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;