import express from "express";

const pathPedidos = "/pedidos";

export default function pedidoRoute(getController) {
    const router = express.Router();
    const controler=getController(ControllerPedidos)

    router.post(pathPedidos, async (req, res) => {
    try {
      await controler.crear(req, res);
    } catch (err) {
      next(err);
    }
    })

    return router;
}