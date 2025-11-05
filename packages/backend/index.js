import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Server from "./server.js";
import PedidoRepository from "./models/repository/pedidoRepository.js";
import ProductosRepository from "./models/repository/productosRepository.js";
import UsuarioRepository from "./models/repository/usuariosRepository.js";
import NotificacionesRepository from "./models/repository/notificacionesRepository.js";
import PedidoService from "./service/pedidoService.js";
import NotificacionService from "./service/notificacionesService.js";
import ProductosService from "./service/productosService.js";
import UsuarioService from "./service/usuarioService.js"
import ControllerPedido from "./controller/ControllerPedidos.js";
import NotificacionesController from "./controller/notificacionesController.js";
import ProductosController from "./controller/productosController.js";
import UsuarioControler from "./controller/usuarioControler.js";
import routes from "./routes/routes.js";
import { MongoDBClient } from "./config/database.js";
// import axios from "axios";

const app = express();

const port = process.env.SERVER_PORT || 3001;
dotenv.config();
const server = new Server(app, port);

const raw = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins = raw ? raw.split(",").map((o) => o.trim()) : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // requests sin origin (curl, server-to-server) => permitir
      if (!origin) return callback(null, true);
      // si no hay lista configurada => permitir todos (dev)
      if (allowedOrigins.length === 0) return callback(null, true);
      // si el origin está en la lista => permitir
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // denegar CORS
      return callback(null, false);
    },
    credentials: true,
  }),
);

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
const serviceNotificaciones = new NotificacionService(notificacionesRepository);
const servicePedido = new PedidoService(
  pedidoRepository,
  usuarioRepository,
  productosRepository,
);
const usuarioService=new UsuarioService(usuarioRepository)

const productosController = new ProductosController(productosService);
const notificacionesController = new NotificacionesController(
  serviceNotificaciones,
);
const usuarioControler=new UsuarioControler(usuarioService)

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

// app.get("/api/rates", async (req, res) => {
//   try {
//     const response = await axios.get("https://api.exchangerate.host/latest?base=USD");
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error obteniendo tasas", error);
//     res.status(500).json({ error: "No se pudo obtener las tasas" });
//   }
// });

// Configurar rutas y controladores en el servidor
server.setController(ControllerPedido, controllerPedido);
server.setController(NotificacionesController, notificacionesController);
server.setController(ProductosController, productosController);
server.setController(NotificacionesController, notificacionesController);
server.setController(ProductosController, productosController);
server.setController(UsuarioControler, usuarioControler);

routes.forEach((route) => server.addRoute(route));
server.configureRoutes();
server.launch();

MongoDBClient.connect();

