import "dotenv/config";
import express from "express";
import cors from "cors";
import  Server from "./Server.js";
import { ControllerPedido } from "./controllers/ControllerPedido.js";
import routes from "./routes/routesPedido.js";

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

// Se envía al server el puerto
const serverPedido = new Server(app, port);
const controllerPedido = new ControllerPedido();
serverPedido.setController(ControllerPedido, controllerPedido);

routes.forEach(route => serverPedido.addRoute(route));
server.configureRoutes();
server.launch();
