import request from 'supertest';
import buildTestServe from './buildTestServe.js';
import ProductosController from '../../controller/productosController.js';
import ProductosService from '../../service/productosService.js';
import productosRoutes from '../../routes/productosRoutes.js';
import { jest } from "@jest/globals";

// Mock vendedor
const mockVendedor = {
  _id: "6920e22c7d295f48e7cf297c",
  idKeycloak: "ce3073ce-897f-45db-a407-0400de0b448e",
  nombre: "agustin rodolf",
  email: "agus@frba.utn.edu.ar",
  telefono: "1164545678",
  tipo: "vendedor",
  fechaAlta: new Date("2025-11-21T22:05:32.507Z"),
  createdAt: new Date("2025-11-21T22:05:32.514Z"),
  updatedAt: new Date("2025-11-21T22:05:32.514Z"),
  __v: 0
};

// Mock producto
const mockProducto = {
  _id: "68ea41c892e0a00d2252935e",
  vendedor: "6920e22c7d295f48e7cf297c",
  titulo: "Cinta de Correr Pro 3000",
  descripcion: "Cinta profesional con pantalla y múltiples programas",
  precio: 250000,
  categoria: "Deportes",
  fotos: "cinta_pro3000.jpg",
  stock: 5,
  activo: true,
  moneda: { tipo: "ARS" },
  vendedorData: mockVendedor // opcional si tu controller popula vendedor
};

// Mock del repository
// Mock del repository
const productoRepo = {
  findById: jest.fn(),
};


const productoService = new ProductosService(productoRepo);
const productosController = new ProductosController(productoService);

const { app, server } = buildTestServe();
server.addRoute(productosRoutes);
server.setController(ProductosController, productosController);
server.configureRoutes();

describe('GET /productos/:idProducto (mock producto + vendedor)', () => {

  test('Deberia devolver un producto por id', async () => {
    productoRepo.findById.mockResolvedValue(mockProducto);
    const response = await request(app).get('/productos/68ea41c892e0a00d2252935e');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      _id: "68ea41c892e0a00d2252935e",
    });
  });

  test('Deberia devolver 204 si el producto no existe', async () => {
    productoRepo.findById.mockResolvedValue(undefined);
    const response = await request(app).get('/productos/000000000000000000000000');
    expect(response.status).toBe(204);
  });

});
