import ProductosController from "../controller/productosController.js";
import express from "express";
import { productosErrorHandler } from "../middleware/ProductosMiddleware.js";
import { loggerMiddleware } from "../middleware/loggerMiddleware.js";

import { ProductoModel } from "../schemas/ProductoSchema.js";
import Producto from "../models/entities/Producto.js";
import mongoose from "mongoose";

const pathProductos = "/productos";

export default function productosRoutes(getController) {
    const router = express.Router();
    const controller = getController(ProductosController);
    
    router.use(loggerMiddleware);

    router.get(pathProductos, async (req, res) => {
        try{
            //await controller.getProductos(req, res);
            console.log("GET /productos llamado");

            // Debug: estado de conexión de mongoose y nombre de BD
            console.log("mongoose readyState:", mongoose.connection.readyState);
            console.log("mongoose DB name:", mongoose.connection?.db?.databaseName);

            const model = ProductoModel;
            console.log("Modelo de producto asignado:", model.modelName, "collection:", model.collection?.collectionName);

            // Intento 1: uso find() normal (Mongoose)
            const productos = await model.find();
            console.log("Productos encontrados (mongoose):", productos.length);

            // Intento 2: acceso directo a la colección Mongo para comprobar documentos "raw"
            const rawDocs = await model.db.db.collection(model.collection.collectionName).find().toArray();
            console.log("Documentos encontrados (raw collection):", rawDocs.length);

            const resp = (productos.length ? productos : rawDocs).map(producto => toDTO(producto));
            console.log("Productos a DTO:", resp.length);
            res.status(200).json(resp)
        }catch(err){
            //next(err);
            res.status(500).json({error: 'Error interno del servidor'});
        }
    });

    router.use(productosErrorHandler);
    return router;
}

function toDTO(producto) {
        return {
            id: producto.id || producto._id, //validacion de if default de mongo
            vendedor: producto.vendedor,
            titulo: producto.titulo,
            descripcion: producto.descripcion,
            categorias: producto.categorias,
            precio: producto.precio,
            moneda: producto.moneda,
            stock: producto.stock,
            fotos: producto.fotos,
            activo: producto.activo,
            ventas: producto.ventas
        };
    }
