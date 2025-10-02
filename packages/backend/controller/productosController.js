import { z } from "zod";

const idTransform = z.string().transform(((val, ctx)  => {
    const num = Number(val);
    if (isNaN(num)) {
        ctx.addIssue({
            code: "INVALID_ID",
            message: "id debe ser un numero"
        });
        return z.NEVER;
    }
    return num;
}))

const activoHandler = {
    true: true,
    false: false
}

export default class ProductosController {
    constructor(productosService){
        this.productosService = productosService;
    }

    async getProductos(req,res){
        const {page=1, limit=10} = req.query
        const {sort="ventas", order="desc"} = req.query
        const filtros = req.query
        const {activo} = req.query
        const activoFinal = activoHandler[activo];
        const ProductosPaginados = await this.productosService.getProductos(filtros, activoFinal, page, limit, sort, order);
        if(ProductosPaginados === null){
            return res.status(204).send("No se encontraron Productos");
        }
        return res.status(200).json(ProductosPaginados);
    }
}