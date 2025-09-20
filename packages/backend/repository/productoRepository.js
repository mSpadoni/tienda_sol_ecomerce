import Producto from "../Dominio/Producto.js";

const prodEjemplo= new Producto(1,null,"milanesa","rica milanesa",["comida"],5000,"Peso Argentino",10,[],true);


export default class ProductoRepository {
  constructor() {
    this.productos = [prodEjemplo];
  }


  findById(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  
    create(producto) {       
    if (this.idBorrados.length > 0) {
      producto.id = this.idBorrados.shift();
    }
  }
}


