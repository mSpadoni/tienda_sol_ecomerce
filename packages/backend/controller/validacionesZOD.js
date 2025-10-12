import z from "zod";

import mongoose from "mongoose";

export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "ID no válido",
  });

export const pedidoPatchSchema = z.object({
  estado: z.string().min(1),
  usuario: objectIdSchema,
  motivo: z.string(),
});

export const direccionSchema = z.object({
  calle: z.string().min(1),
  altura: z.string().min(1),
  piso: z.string(),
  departamento: z.string(),
  codigoPostal: z.string(),
  ciudad: z.string(),
  provincia: z.string(),
  pais: z.string(),
  lat: z.string(),
  long: z.string(),
});

export const pedidoSchema = z.object({
  usuario: objectIdSchema,
  moneda: z.string().min(1),
  direccionEntrega: direccionSchema,
  items: z.array(
    z.object({
      productoId: objectIdSchema,
      cantidad: z.coerce.number(),
    }),
  ),
});
