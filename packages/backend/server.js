import express from "express";
import logger from "../logger/logger.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
// El server recibe las rutas y recibe el puerto
export default class Server {
  constructor(app, port) {
    this.app = app;
    this.port = port;
    this.routes = [];
    this.controllers = {};
    this.app.use(express.json());
    this.app.use(cors({
    origin: 'http://localhost:3000', // frontend React
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
    const swaggerDocument = YAML.load(new URL("./swagger.yaml", import.meta.url));
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  app() {
    return this.app;
  }


  setController(controllerClass, controller) {
    this.controllers[controllerClass.name] = controller;
  }

  getController(controllerClass) {
    const controller = this.controllers[controllerClass.name];
    if (!controller) {
      throw new Error("Controller missing for the given route.");
    }
    return controller;
  }

  addRoute(route) {
    this.routes.push(route);
  }

  configureRoutes() {
    this.routes.forEach((route) =>
      this.app.use(route(this.getController.bind(this))),
    );
  }

  launch() {
    this.app.listen(this.port, () => {
      logger.info("Server running on port " + this.port);
    });
  }
}
