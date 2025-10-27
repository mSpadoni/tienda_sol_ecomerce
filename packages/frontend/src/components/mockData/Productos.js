const productos = [
  {
    id: "1",
    titulo: "Termo stanley",
    descripcion: "Termo de acero inoxidable, 1L",
    precio: 15000,
    categoria: "Hogar",
    imagen: "/images/6d70946c4c19c96dfc1e76af8668.jpg",
    stock: 20,
    activo: true,
    vendedor: "Juan Pérez",
    ventas: 5,
    moneda: { nombre: "Peso Argentino", simbolo: "$" }
  },
  {
    id: "2",
    titulo: "Playstation 5",
    descripcion: "Consola de videojuegos de última generación",
    precio: 35000,
    categoria: "Electrónica",
    imagen: "/images/51fM0CKG+HL._SL1500_.jpg",
    stock: 10,
    activo: true,
    vendedor: "Ana López",
    ventas: 12,
    moneda: { nombre: "Peso Argentino", simbolo: "$" }
  },
  {
    id: "3",
    titulo: "Calza deportiva para mujer negra",
    descripcion: "Calza deportiva negra, talle M",
    precio: 42000,
    categoria: "Ropa",
    imagen: "/images/Calza-deportiva-para-mujer-SWAN-370x444.jpg",
    stock: 5,
    activo: false,
    vendedor: "Carlos Gómez",
    ventas: 3,
    moneda: { nombre: "Peso Argentino", simbolo: "$" }
  }
];

export default productos;