import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import NotificacionesRepository  from "./models/repository/notificacionesRepository.js";
import NotificacionesService from "./service/notificacionesService.js";
import NotificacionesController from "./controller/notificacionesController.js";
import ProductosRepository  from "./models/repository/productosRepository.js";
import ProductosService from "./service/productosService.js";
import ProductosController from "./controller/productosController.js";
import routes from "./routes/routes.js"
import { Server } from "./server.js"
import { MongoDBClient } from "./config/database.js";

const app = express();

const port = process.env.SERVER_PORT || 3001;
dotenv.config();
const server = new Server(app, port);

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
});

const notificacionesRepository = new NotificacionesRepository();
const notificacionesService = new NotificacionesService(notificacionesRepository);
const notificacionesController = new NotificacionesController(notificacionesService);

// productos 
const productosRepository = new ProductosRepository();
const productosService = new ProductosService(productosRepository);
const productosController = new ProductosController(productosService);

server.setController(NotificacionesController, notificacionesController)
server.setController(ProductosController, productosController)

routes.forEach(route  => {server.addRoute(route)});
server.configureRoutes();
server.launch();

MongoDBClient.connect();