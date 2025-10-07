import express from "express";
import logger from "../logger/logger.js";
// El server recibe las rutas y recibe el puerto
export default class Server {
  #controllers = {};
  #app;
  #routes;

  constructor(app, port) {
    this.#app = app;
    this.port = port;
    this.#routes = [];
    this.#app.use(express.json());
  }

  app() {
    return this.#app;
  }

  setController(controllerClass, controller) {
    this.#controllers[controllerClass.name] = controller;
  }

  getController(controllerClass) {
    const controller = this.#controllers[controllerClass.name];
    if (!controller) {
      throw new Error("Controller missing for the given route.");
    }
    return controller;
  }

  addRoute(route) {
    this.#routes.push(route);
  }

  configureRoutes() {
    this.#routes.forEach((route) =>
      this.#app.use(route(this.getController.bind(this))),
    );
  }

  launch() {
    this.#app.listen(this.port, () => {
      logger.info("Server running on port " + this.port);
    });
  }
}
