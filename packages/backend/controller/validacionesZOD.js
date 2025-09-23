import z
from "zod";

export
const pedidoPatchSchema = z.object({
  estado: z.string().min(1),
  usuario: z.number(),
  motivo: z.string(),
});

export
const direccionSchema = z.object({
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

export
const pedidoSchema = z.object({
  usuario: z.number().min(1),
  moneda: z.string().min(1),
  direccionEntrega: direccionSchema,
  items: z.array(
    z.object({
      productoId: z.coerce.number(),
      cantidad: z.coerce.number(),
    }),
  ),
});

export
const idTransform = z.string().transform((val, ctx) => {
  const num = Number(val);
  if (isNaN(num)) {
    ctx.addIssue({
      code: "INVALID_ID"
    });
    return z.NEVER;
  }
  if (num <= 0) {
    ctx.addIssue({
      code: "INVALID_ID"
    });
    return z.NEVER;
  }
  return num;
});
