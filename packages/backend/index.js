import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Server from "./server.js";
import PedidoRepository from "./models/repository/pedidoRepository.js";
import ProductosRepository from "./models/repository/productosRepository.js";
import UsuarioRepository from "./models/repository/usuariosRepository.js";
import NotificacionesRepository from "./models/repository/notificacionesRepository.js";
import PedidoService from "./service/pedidoService.js";
import NotificacionService from "./service/notifyServiceAux.js";
import NotificacionesService from "./service/notificacionesService.js";
import ProductosService from "./service/productosService.js";
import ControllerPedido from "./controller/ControllerPedidos.js";
import NotificacionesController from "./controller/notificacionesController.js";
import ProductosController from "./controller/productosController.js";
import routes from "./routes/routes.js";
import { MongoDBClient } from "./config/database.js";

const app = express();

const port = process.env.SERVER_PORT || 3001;
dotenv.config();
const server = new Server(app, port);

app.use(express.json());

dotenv.config();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

const pedidoRepository = new PedidoRepository();
const usuarioRepository = new UsuarioRepository();
const productosRepository = new ProductosRepository();
const notificacionesRepository = new NotificacionesRepository();

const productosService = new ProductosService(productosRepository);
const notificacionesService = new NotificacionesService(notificacionesRepository);
const serviceNotificaciones = new NotificacionService(notificacionesRepository);
const servicePedido = new PedidoService(
  pedidoRepository,
  usuarioRepository,
  productosRepository,
);

const productosController = new ProductosController(productosService);
const notificacionesController = new NotificacionesController(notificacionesService);
const controllerPedido = new ControllerPedido(
  servicePedido,
  serviceNotificaciones,
);


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  // authMiddleware(req, res,next)
  res.status(200).json({ message: "Bienvenido " + req.user.nombre });
});

// Configurar rutas y controladores en el servidor
server.setController(ControllerPedido, controllerPedido);
server.setController(NotificacionesController, notificacionesController)
server.setController(ProductosController, productosController)

routes.forEach((route) => server.addRoute(route));
server.configureRoutes();
server.launch();

MongoDBClient.connect();