import mongoose from "mongoose";
import Producto from "../models/entities/Producto.js";

const productoSchema = new mongoose.Schema(
  {
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
    categorias: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    // moneda: {
    //   type: Object,
    //   required: true,
    // },
    stock: {
      type: Number,
      required: true,
    },
    fotos: {
      type: String,
      required: true,
    },
    activo: {
      type: Boolean,
      required: true,
    },
        ventas: {
      type: Number,
      required: true,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true,
    collection: "Producto",
  },
);

productoSchema.pre(/^find/, function (next) {
  this.populate("vendedor", "");
  next();
});

productoSchema.loadClass(Producto);

export const ProductoModel = mongoose.model("Producto", productoSchema);
