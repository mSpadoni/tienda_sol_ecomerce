import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Server from "./Server.js";
import ControllerUsuarios from "./controller/ControllerUsuarios.js";
import ControllerPedido from "./controller/ControllerPedidos.js";
import UsuarioService from "./service/usuarioService.js";
import PedidoService from "./service/pedidoService.js";
import PedidoRepository from "./repository/pedidoRepository.js";
import ProductoRepository from "./repository/productoRepository.js";
import UsuarioRepository from "./repository/usuariosRepository.js";
import routes from "./routes/routes.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import authMiddleware from "./middlewares/autentificacionMiddlewares.js";

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(`mi secreto `));
app.use(
  session({
    secret: `mi secreto `,
    resave: false,
    saveUninitialized: false, 
  }));
app.use(passport.initialize());
app.use(passport.session());

    

dotenv.config();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);


// Configurar el puerto
const port = process.env.SERVER_PORT || 3000;

// Crear instancia del servidor
const server = new Server(app, port);

// Crear instancias de repositorios
const pedidoRepository = new PedidoRepository();
const usuarioRepository = new UsuarioRepository();
const productoRepository = new ProductoRepository();

// Crear instancias de servicios
const usuarioService = new UsuarioService(pedidoRepository, usuarioRepository);
const servicePedido = new PedidoService(
  pedidoRepository,
  usuarioRepository,
  productoRepository,
);

// Crear instancias de controladores
const controllerUsuarios = new ControllerUsuarios(usuarioService);
const controllerPedido = new ControllerPedido(servicePedido);

// Configurar rutas y controladores en el servidor
server.setController(ControllerUsuarios, controllerUsuarios);
server.setController(ControllerPedido, controllerPedido);
routes.forEach((route) => server.addRoute(route));
server.configureRoutes();

// Iniciar el servidor
server.launch();

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

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res,next) => {
  authMiddleware(req, res,next)
  res.status(200).json({message:"Bienvenido "+req.user.nombre});
});