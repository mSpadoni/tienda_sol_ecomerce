// scripts/cloneDb.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// IMPORTÁS SOLO EL SCHEMA (no el modelo)
import { UsuarioSchema } from "../schemas/UsuarioSchema.js";
import { productoSchema } from "../schemas/ProductoSchema.js";
import { PedidoSchema } from "../schemas/PedidoSchema.js";
import { notificacionSchema } from "../schemas/NotificacionSchema.js";

const REAL_URI = process.env.MONGODB_URI;
const TEST_URI = process.env.MONGODB_TEST_URI;

async function cloneCollection(realDB, testDB, schema, name) {
  // Crear modelos dentro de cada conexión
  const Real = realDB.model(name, schema);
  const Test = testDB.model(name, schema);

  const docs = await Real.find().lean();

  await Test.deleteMany({});
  if (docs.length) await Test.insertMany(docs);

  console.log(`✔ ${name}: clonados ${docs.length}`);
}

async function cloneDb() {
  const realDB = await mongoose.createConnection(REAL_URI).asPromise();
  const testDB = await mongoose.createConnection(TEST_URI).asPromise();

  const items = [
    [UsuarioSchema, "Usuario"],
    [productoSchema, "Producto"],
    [PedidoSchema, "Pedido"],
    [notificacionSchema, "Notificacion"],
  ];

  for (const [schema, name] of items) {
    await cloneCollection(realDB, testDB, schema, name);
  }

  await realDB.close();
  await testDB.close();
  console.log("Clonación completada.");
  process.exit(0);
}

cloneDb();
