import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaApple, FaGooglePlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer compact-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="brand">
            <button className="logo-footer" aria-label="Tienda del Sol - ir a inicio">TiendaSol</button>
            <div className="app-badges" aria-hidden="true">
              <span className="badge">App Store</span>
              <span className="badge">Google Play</span>
            </div>
          </div>

          <div className="social">
            <a href="#" aria-label="Facebook" className="social-link"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram" className="social-link"><FaInstagram /></a>
            <a href="#" aria-label="Twitter" className="social-link"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="links-column">
            <h5>Comprar</h5>
            <ul>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Ofertas</a></li>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Categorías</a></li>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Historial</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h5>Vender</h5>
            <ul>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Vende en TiendaSol</a></li>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Precios y planes</a></li>
            </ul>
          </div>

          <div className="links-column">
            <h5>Atención</h5>
            <ul>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Centro de ayuda</a></li>
              <li><Link to="/contactanos">Contactanos</Link></li>
            </ul>
          </div>

          <div className="links-column">
            <h5>Compañía</h5>
            <ul>
              <li><Link to="/sobre-nosotros">Sobre nosotros</Link></li>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Trabajo</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="legal">
            <p>&copy; {new Date().getFullYear()} Tienda del Sol. Todos los derechos reservados.</p>
            <div className="legal-links">
              <a href="#">Términos</a>
              <a href="#">Privacidad</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;