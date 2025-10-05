import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Server from "./server.js";
import ControllerPedido from "./controller/ControllerPedidos.js";
import PedidoService from "./service/pedidoService.js";
import NotificacionService from "./service/notifyServiceAux.js";
import PedidoRepository from "./repository/pedidoRepository.js";
import ProductoRepository from "./repository/productoRepository.js";
import UsuarioRepository from "./repository/usuariosRepository.js";
import NotificacionesRepository from "./repository/notificacionesRepository.js";
import routes from "./routes/routes.js";
//import passport from "passport";
/*import cookieParser from "cookie-parser";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import authMiddleware from "./middlewares/autentificacionMiddlewares.js";*/
import NotificacionesService from "./service/notificacionesService.js";
import NotificacionesController from "./controller/notificacionesController.js";
import ProductosRepository  from "./models/repository/productosRepository.js";
import ProductosService from "./service/productosService.js";
import ProductosController from "./controller/productosController.js";
import { MongoDBClient } from "./config/database.js";

const app = express();

const port = process.env.SERVER_PORT || 3001;
dotenv.config();
const server = new Server(app, port);

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
/*app.use(cookieParser(`mi secreto `));
app.use(
  session({
    secret: `mi secreto `,
    resave: false,
    saveUninitialized: false, 
  }));
app.use(passport.initialize());
app.use(passport.session());*/

dotenv.config();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

// Crear instancias de repositorios
const pedidoRepository = new PedidoRepository();
const usuarioRepository = new UsuarioRepository();
const productoRepository = new ProductoRepository();
// Crear instancias de servicios

const servicePedido = new PedidoService(
  pedidoRepository,
  usuarioRepository,
  productoRepository,
);
const serviceNotificaciones = new NotificacionService(notificacionesRepository);

// Crear instancias de controladores
const controllerPedido = new ControllerPedido(
  servicePedido,
  serviceNotificaciones,
);

// Configurar rutas y controladores en el servidor
server.setController(ControllerPedido, controllerPedido);
routes.forEach((route) => server.addRoute(route));
server.configureRoutes();

// Iniciar el servidor
server.launch();
/*
passport.use(new LocalStrategy(
  function(username, password, done) {
     const usuario=usuarioRepository.obtenerUsuarioByUsernameAndPassword(username, password);
      if(!usuario){ return done(null, false,{message:"Usuario o contraseña incorrecta"});
      }
      return done(null, usuario);
  }
))

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  const usuario=usuarioRepository.obtenerUsuarioById(id);    
  done(null, usuario);
});


app.post("/login", passport.authenticate({
  successRedirect:"/",
  failureRedirect:"/login"
}))
*/

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