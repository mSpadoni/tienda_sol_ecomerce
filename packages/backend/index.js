import "dotenv/config";
import express from "express";
import cors from "cors";
import  Server from "./Server.js";
import { ControllerPedido } from "./controllers/ControllerPedido.js";
import routes from "./routes/routesPedido.js";
import { PedidoRepository } from "./repository/pedidoRepository.js";

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
   })
  })

   
   
const port = process.env.SERVER_PORT || 3000

// Crear Server pedidos
const serverPedido = new Server(app, port);

const repositorioPedido = new PedidoRepository();
const servicePedido = new pedidoService(repositorioPedido);
const controllerPedido = new ControllerPedido(servicePedido);
serverPedido.setController(ControllerPedido, controllerPedido);


routes.forEach(route => serverPedido.addRoute(route));
server.configureRoutes();
server.launch();
