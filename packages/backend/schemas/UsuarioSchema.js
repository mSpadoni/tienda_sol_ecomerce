import mongoose from "mongoose";
import { TipoUsuario } from "../models/entities/TipoUsuario.js";
import Usuario from "../models/entities/Usuario.js";

export const UsuarioSchema = new mongoose.Schema(
  {
    idKeycloak: {
      type: String,
      required: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: [TipoUsuario.COMPRADOR, TipoUsuario.VENDEDOR, TipoUsuario.ADMIN],
      required: true,
    },
    fechaAlta: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "usuarios",
  },
);
UsuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);
