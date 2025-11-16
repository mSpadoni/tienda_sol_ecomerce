import mongoose from "mongoose";
import Producto from "../models/entities/Producto.js";

export const productoSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
    },
    fotos: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    activo: {
      type: Boolean,
      required: true,
    },
    moneda: {
      type: Object,
      required: true,
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true,
    collection: "productos",
  },
);

productoSchema.pre(/^find/, function (next) {
  this.populate("vendedor", "");
  next();
});

productoSchema.loadClass(Producto);

export const ProductoModel = mongoose.model("Producto", productoSchema);
