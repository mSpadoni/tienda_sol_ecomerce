import Pedido  from "../model/Pedido.js";
import { z } from "zod";

export class ControllerPedidos {
    constructor(servicePedido) 
    {
        this.servicePedido = servicePedido;
    }
    async crear(req, res) {
        //TODO: Validar datos de entrada
        const resultBody = alojamientoSchema.safeParse(body);

        if (!resultBody.success) {
            return res.status(400).json({ error: resultBody.error.issues });
        }

        
        const nuevoPedido= await this.servicePedido.crear(resultBody.data)
        res.status(201).json(nuevoPedido);
    };
}

const PedidoSchema = z.object({
  usuario: z.string().min(1),
  moneda: z.string().min(1),
  direccionEntrega: z.string().min(1),
  fecha: z.Date(),
  items: z.array(z.object({
    productoId: z.string().min(1),
    cantidad: z.number().min(1)
    })
    )
})
