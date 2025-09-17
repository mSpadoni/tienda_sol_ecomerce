import { z } from "zod";

const idTransform = z.string().transform(((val, ctx)  => {
    const num = Number(val);
    if (isNaN(num)) {
        ctx.addIssue({
            code: "INVALID_ID",
            message: "id must be a number"
        });
        return z.NEVER;
    }
    return num;
}))

export default class ProductosController {
    constructor(productosService){
        this.productosService = productosService;
    }

    getProductos(req,res){
        let {activo} = req.query
        const filtros = req.query
        if (activo !== undefined){
            if(activo === "true"){
                activo = true
            }
            else if (activo === "false"){
                activo = false
            }
            else {
                activo = undefined
            }
        }
        const Productos = this.productosService.getProductos(filtros, activo);
        if(Productos === null){
            return res.status(204).send("No se encontraron Productos");
        }
        return res.status(200).json(Productos);
    }
}