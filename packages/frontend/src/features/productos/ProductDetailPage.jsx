import PropTypes from 'prop-types';
import React from 'react';
import productos from '../../components/mockData/Productos.js';
import './ProductDetailPage.css';

const ProductDetailPage = (props) => {
  const id = props.id;
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return (
      <div className="producto-detail-container">
        <div className="producto-header">
          <h1>Producto no encontrado</h1>
          <p>Lo sentimos, no pudimos encontrar el producto que buscas.</p>
        </div>
      </div>
    );
  } 

  return (
    <div className="producto-detail-container">
      <div className="producto-header">
        <h1 className="producto-nombre">{producto.titulo}</h1>
      </div>

      <div className="producto-content">
        <div className="producto-image-section">
          <img 
            src={producto.imagen} 
            alt={producto.titulo} 
            className="producto-imagen"
          />
        </div>

        <div className="producto-info-section">
          <div className="producto-description">
            {producto.descripcion}
          </div>

          <div className="producto-price-section">
            <div className="producto-precio">{producto.moneda?.simbolo} {producto.precio?.toLocaleString()}</div>
            <div className="price-details">Impuestos incluidos</div> 
            <div className="comprar-container">
            <button className="comprar">Comprar</button>
        </div>       
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;

ProductDetailPage.propTypes = {
  id: PropTypes.string.isRequired,
};