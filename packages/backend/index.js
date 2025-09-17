import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Server from "./Server.js";
import ControllerUsuarios from "./controller/ControllerUsuarios.js";
import UsuarioService from "./service/usuarioService.js";
import PedidoRepository  from "./repository/pedidoRepository.js";
import routes from "./routes/routes.js";

const app = express();
app.use(express.json());

dotenv.config();
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



const port = process.env.SERVER_PORT || 3000;

// Se envía al server el puerto
const server = new Server(app, port);

const pedidoRepository= new PedidoRepository();
const usuarioService = new UsuarioService(
  pedidoRepository,
);
const controllerUsuarios = new ControllerUsuarios(usuarioService);
server.setController(ControllerUsuarios, controllerUsuarios);
routes.forEach((route) => server.addRoute(route));
server.configureRoutes();
server.launch();
