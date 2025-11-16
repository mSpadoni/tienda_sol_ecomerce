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
});

export const pedidoSchema = z.object({
  moneda: z.string().min(1),
  direccionEntrega: direccionSchema,
  items: z
    .array(
      z.object({
        productoId: objectIdSchema,
        cantidad: z.coerce.number(),
      }),
    )
    .min(1),
});

export const validadIdkecloark = z.string().min(1);

export const createUserSchema = z
  .object({
    username: z.string().nonempty("El username es obligatorio"),
    nombre: z.string().nonempty("El nombre es obligatorio"),
    apellido: z.string().nonempty("El apellido es obligatorio"),
    email: z.string().email("El email no es válido"),
    telefono: z.string().nonempty("El teléfono es obligatorio"),
    password: z.string().nonempty("La contraseña es obligatoria"),
    rol: z.string().optional(),
  })
  .strict(); // <- Esto hace que si viene un campo extra, tire error
