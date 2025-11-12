import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import Server from "./server.js";
import PedidoRepository from "./models/repository/pedidoRepository.js";
import ProductosRepository from "./models/repository/productosRepository.js";
import UsuarioRepository from "./models/repository/usuariosRepository.js";
import NotificacionesRepository from "./models/repository/notificacionesRepository.js";
import PedidoService from "./service/pedidoService.js";
import NotificacionService from "./service/notificacionesService.js";
import ProductosService from "./service/productosService.js";
import UsuarioService from "./service/usuarioService.js";
import ControllerPedido from "./controller/ControllerPedidos.js";
import NotificacionesController from "./controller/notificacionesController.js";
import ProductosController from "./controller/productosController.js";
import UsuarioControler from "./controller/usuarioControler.js";
import routes from "./routes/routes.js";
import { MongoDBClient } from "./config/database.js";
import logger from "../logger/logger.js";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3001;
const server = new Server(app, port);

// Configuración CORS
const raw = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins = raw ? raw.split(",").map((o) => o.trim()) : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  }),
);

app.use(express.json());

// Repositorios
const pedidoRepository = new PedidoRepository();
const usuarioRepository = new UsuarioRepository();
const productosRepository = new ProductosRepository();
const notificacionesRepository = new NotificacionesRepository();

// Servicios
const productosService = new ProductosService(productosRepository);
const serviceNotificaciones = new NotificacionService(notificacionesRepository);
const servicePedido = new PedidoService(
  pedidoRepository,
  usuarioRepository,
  productosRepository,
);
const usuarioService = new UsuarioService(usuarioRepository);

// Controladores
const productosController = new ProductosController(productosService);
const notificacionesController = new NotificacionesController(
  serviceNotificaciones,
);
const usuarioControler = new UsuarioControler(usuarioService);
const controllerPedido = new ControllerPedido(
  servicePedido,
  serviceNotificaciones,
);

// Rutas de prueba
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Bienvenido " + req.user?.nombre || "invitado" });
});

// -----------------------------
// NUEVA RUTA /api/rates
// -----------------------------

const ratesCache = {};
const CACHE_TIME = 10 * 60 * 1000; // 10 minutos

app.get("/api/rates", async (req, res) => {
  const { base, target } = req.query;

  if (!base || !target) {
    return res.status(400).json({ error: "Faltan parámetros base o target" });
  }

  const baseLower = base.toLowerCase();
  const targetLower = target.toLowerCase();
  const cacheKey = `${baseLower}_${targetLower}`;
  const now = Date.now();

  // Verificar cache
  if (
    ratesCache[cacheKey] &&
    now - ratesCache[cacheKey].timestamp < CACHE_TIME
  ) {
    return res.json({ rate: ratesCache[cacheKey].rate });
  }

  try {
    // URL de la API (sin params)
    logger.info(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseLower}.json`,
    );
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseLower}.json`;
    const response = await axios.get(url);
    logger.info(response.data);
    // Extraer tasa según el formato que me pasaste
    const rate = response.data[baseLower][targetLower];

    logger.info(rate);
    if (!rate) {
      return res
        .status(404)
        .json({ error: `Tasa no encontrada para ${base} → ${target}` });
    }


    ratesCache[cacheKey] = { rate, timestamp: now };

    return res.status(200).json({ rate });
  } catch (err) {
    console.error("Error consultando API externa:", err.message);
    return res
      .status(500)
      .json({ error: "Error obteniendo la tasa de cambio" });
  }
});

// Configurar rutas y controladores en el servidor
server.setController(ControllerPedido, controllerPedido);
server.setController(NotificacionesController, notificacionesController);
server.setController(ProductosController, productosController);
server.setController(UsuarioControler, usuarioControler);

routes.forEach((route) => server.addRoute(route));
server.configureRoutes();
server.launch();

// Conexión a MongoDB
MongoDBClient.connect();
