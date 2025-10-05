import Producto from "../Dominio/Producto.js";
import Usuario from "../Dominio/Usuario.js";

const prodEjemplo = new Producto(
  1,
  new Usuario(3, "admin", "@gmail.com", " ", "Admin", new Date()),
  "milanesa",
  "rica milanesa",
  ["comida"],
  5000,
  "Peso Argentino",
  10,
  [],
  true,
);

const prodEjemplo2 = new Producto(
  2,
  new Usuario(3, "admin", "@gmail.com", " ", "Admin", new Date()),
  "milanesa",
  "rica milanesa",
  ["comida"],
  5000,
  "Peso Argentino",
  10,
  [],
  true,
);

export default class ProductoRepository {
  constructor() {
    this.productos = [prodEjemplo, prodEjemplo2];
  }

  findById(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  create(producto) {
    if (this.idBorrados.length > 0) {
      producto.id = this.idBorrados.shift();
    }
  }

  updateProducto(producto){
    const index = this.productos.findIndex((p) => p.id === producto.id)
    if (index !== -1) {
      this.productos[index].stock=producto.stock
    }
  }
}
