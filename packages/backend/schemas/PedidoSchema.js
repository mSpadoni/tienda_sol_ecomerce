import mongoose from "mongoose";

import { EstadoPedido } from "../models/entities/EstadoPedido.js";
import DireccionEntrega from "../models/entities/DireccionEntrega.js";
import ItemPedido from "../models/entities/ItemPedido.js";
import CambioEstadoPedido from "../models/entities/CambioEstadoPedido.js";
import Pedido from "../models/entities/Pedido.js";
import findEstado from "../models/entities/EstadoPedido.js";

const DireccionEntregaSchema = new mongoose.Schema(
  {
    calle: { type: String, required: true },
    altura: { type: String, required: true },
    piso: { type: String, required: false },
    departamento: { type: String, required: false},
    codigoPostal: { type: String, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    pais: { type: String, required: true },
    //to do: si se implementa un servicio de mapas, agregar validacion de lat y lon
    lat: { type: String, required: false },
    lon: { type: String, required: false },
  },
  { _id: false },
);

DireccionEntregaSchema.loadClass(DireccionEntrega);

const ItemPedidoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
    },
    precioUnitario: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

ItemPedidoSchema.loadClass(ItemPedido);

const cambioEstadoPedidoSchema = new mongoose.Schema(
  {
    fecha: { type: Date, required: true },
    estado: {
      type: String,
      enum: Object.values(EstadoPedido).map((e) => e.valor),
      required: true,
      get: (estado) => findEstado(estado),
      set: (estadoObj) => {
        if (typeof estadoObj === "string") return estadoObj;
        return estadoObj.valor;
      },
    },
    pedido: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pedido",
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    motivo: { type: String, required: true },
  },
  { _id: false },
);

cambioEstadoPedidoSchema.loadClass(CambioEstadoPedido);

export const PedidoSchema = new mongoose.Schema(
  {
    comprador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    items: [
      {
        type: ItemPedidoSchema,
        required: true,
      },
    ],
    moneda: {
      type: Object,
      required: true,
    },
    direccionEntrega: {
      type: DireccionEntregaSchema,
      required: true,
    },
    estado: {
      type: String,
      enum: Object.values(EstadoPedido).map((e) => e.valor),
      required: true,
      get: (estado) => findEstado(estado),
      set: (estadoObj) => {
        if (typeof estadoObj === "string") return estadoObj;
        return estadoObj.valor;
      },
    },
    fechaCreacion: {
      type: Date,
      required: true,
    },
    historialEstado: [
      {
        type: cambioEstadoPedidoSchema,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: "Pedido",
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

PedidoSchema.pre(/^find/, function (next) {
  this.populate("comprador").populate("items.producto").populate({
    path: "historialEstado.usuario",
    model: "Usuario",
  });
  next();
});

PedidoSchema.loadClass(Pedido);

export const PedidoModel = mongoose.model("Pedido", PedidoSchema);
