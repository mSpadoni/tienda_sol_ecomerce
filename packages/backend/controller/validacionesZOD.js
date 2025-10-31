import z from "zod";

import mongoose from "mongoose";

export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val));

export const pedidoPatchSchema = z.object({
  estado: z.string().min(1),
  motivo: z.string(),
});

export const direccionSchema = z.object({
  calle: z.string().min(1),
  altura: z.string().min(1),
  piso: z.string(),
  departamento: z.string(),
  codigoPostal: z.string().min(1),
  ciudad: z.string().min(1),
  provincia: z.string().min(1),
  pais: z.string().min(1),
  lat: z.string(),
  long: z.string(),
});

export const pedidoSchema = z.object({
  moneda: z.string().min(1),
  direccionEntrega: direccionSchema,
  items: z.array(
    z.object({
      productoId: objectIdSchema,
      cantidad: z.coerce.number(),
    }),
  ).min(1),
});

export const validadIdkecloark = z.string().min(1);

